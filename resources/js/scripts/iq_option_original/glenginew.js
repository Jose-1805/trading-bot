var Module = typeof GLEngineModule !== "undefined" ? GLEngineModule : {};
if (!Module.expectedDataFileDownloads) {
    Module.expectedDataFileDownloads = 0;
    Module.finishedDataFileDownloads = 0
}
Module.expectedDataFileDownloads++;
(function() {
    var loadPackage = function(metadata) {
        var PACKAGE_PATH;
        if (typeof window === "object") {
            PACKAGE_PATH = window["encodeURIComponent"](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf("/")) + "/")
        } else if (typeof location !== "undefined") {
            PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf("/")) + "/")
        } else {
            throw "using preloaded data can only be done on a web page or in a web worker"
        }
        var PACKAGE_NAME = "glenginewbd47f36c.data";
        var REMOTE_PACKAGE_BASE = "glenginewbd47f36c.data";
        if (typeof Module["locateFilePackage"] === "function" && !Module["locateFile"]) {
            Module["locateFile"] = Module["locateFilePackage"];
            err("warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)")
        }
        var REMOTE_PACKAGE_NAME = Module["locateFile"] ? Module["locateFile"](REMOTE_PACKAGE_BASE, "") : REMOTE_PACKAGE_BASE;
        var REMOTE_PACKAGE_SIZE = metadata.remote_package_size;
        var PACKAGE_UUID = metadata.package_uuid;

        function fetchRemotePackage(packageName, packageSize, callback, errback) {
            var xhr = new XMLHttpRequest;
            xhr.open("GET", packageName, true);
            xhr.responseType = "arraybuffer";
            xhr.onprogress = function(event) {
                var url = packageName;
                var size = packageSize;
                if (event.total) size = event.total;
                if (event.loaded) {
                    if (!xhr.addedTotal) {
                        xhr.addedTotal = true;
                        if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
                        Module.dataFileDownloads[url] = {
                            loaded: event.loaded,
                            total: size
                        }
                    } else {
                        Module.dataFileDownloads[url].loaded = event.loaded
                    }
                    var total = 0;
                    var loaded = 0;
                    var num = 0;
                    for (var download in Module.dataFileDownloads) {
                        var data = Module.dataFileDownloads[download];
                        total += data.total;
                        loaded += data.loaded;
                        num++
                    }
                    total = Math.ceil(total * Module.expectedDataFileDownloads / num);
                    if (Module["setStatus"]) Module["setStatus"]("Downloading data... (" + loaded + "/" + total + ")")
                } else if (!Module.dataFileDownloads) {
                    if (Module["setStatus"]) Module["setStatus"]("Downloading data...")
                }
            };
            xhr.onerror = function(event) {
                throw new Error("NetworkError for: " + packageName)
            };
            xhr.onload = function(event) {
                if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || xhr.status == 0 && xhr.response) {
                    var packageData = xhr.response;
                    callback(packageData)
                } else {
                    throw new Error(xhr.statusText + " : " + xhr.responseURL)
                }
            };
            xhr.send(null)
        }

        function handleError(error) {
            console.error("package error:", error)
        }
        var fetchedCallback = null;
        var fetched = Module["getPreloadedPackage"] ? Module["getPreloadedPackage"](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;
        if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
            if (fetchedCallback) {
                fetchedCallback(data);
                fetchedCallback = null
            } else {
                fetched = data
            }
        }, handleError);

        function runWithFS() {
            function assert(check, msg) {
                if (!check) throw msg + (new Error).stack
            }
            Module["FS_createPath"]("/", "styles", true, true);
            Module["FS_createPath"]("/styles", "themes", true, true);
            Module["FS_createPath"]("/", "ani_connection_logo", true, true);
            Module["FS_createPath"]("/", "indicators", true, true);
            Module["FS_createPath"]("/", "shaders", true, true);
            Module["FS_createPath"]("/shaders", "glsl100es", true, true);
            Module["FS_createPath"]("/", "layouts", true, true);
            Module["FS_createPath"]("/layouts", "customDialogs", true, true);
            Module["FS_createPath"]("/layouts", "heap", true, true);
            Module["FS_createPath"]("/layouts", "VideoEducation", true, true);
            Module["FS_createPath"]("/layouts", "leftPanel", true, true);
            Module["FS_createPath"]("/layouts", "settings", true, true);
            Module["FS_createPath"]("/layouts", "mobile", true, true);
            Module["FS_createPath"]("/layouts", "balances", true, true);
            Module["FS_createPath"]("/layouts", "tradingHistory", true, true);
            Module["FS_createPath"]("/layouts", "activeSelector", true, true);
            Module["FS_createPath"]("/", "portfolio", true, true);
            Module["FS_createPath"]("/", "ani_trash", true, true);

            function DataRequest(start, end, audio) {
                this.start = start;
                this.end = end;
                this.audio = audio
            }
            DataRequest.prototype = {
                requests: {},
                open: function(mode, name) {
                    this.name = name;
                    this.requests[name] = this;
                    Module["addRunDependency"]("fp " + this.name)
                },
                send: function() {},
                onload: function() {
                    var byteArray = this.byteArray.subarray(this.start, this.end);
                    this.finish(byteArray)
                },
                finish: function(byteArray) {
                    var that = this;
                    Module["FS_createDataFile"](this.name, null, byteArray, true, true, true);
                    Module["removeRunDependency"]("fp " + that.name);
                    this.requests[this.name] = null
                }
            };
            var files = metadata.files;
            for (var i = 0; i < files.length; ++i) {
                new DataRequest(files[i].start, files[i].end, files[i].audio).open("GET", files[i].filename)
            }

            function processPackageData(arrayBuffer) {
                Module.finishedDataFileDownloads++;
                assert(arrayBuffer, "Loading data file failed.");
                assert(arrayBuffer instanceof ArrayBuffer, "bad input to processPackageData");
                var byteArray = new Uint8Array(arrayBuffer);
                DataRequest.prototype.byteArray = byteArray;
                var files = metadata.files;
                for (var i = 0; i < files.length; ++i) {
                    DataRequest.prototype.requests[files[i].filename].onload()
                }
                Module["removeRunDependency"]("datafile_glenginew.data")
            }
            Module["addRunDependency"]("datafile_glenginew.data");
            if (!Module.preloadResults) Module.preloadResults = {};
            Module.preloadResults[PACKAGE_NAME] = {
                fromCache: false
            };
            if (fetched) {
                processPackageData(fetched);
                fetched = null
            } else {
                fetchedCallback = processPackageData
            }
        }
        if (Module["calledRun"]) {
            runWithFS()
        } else {
            if (!Module["preRun"]) Module["preRun"] = [];
            Module["preRun"].push(runWithFS)
        }
    };
    loadPackage({
        "files": [{
            "start": 0,
            "audio": 0,
            "end": 1791,
            "filename": "/layout_strikes_popup.vui"
        }, {
            "start": 1791,
            "audio": 0,
            "end": 3602,
            "filename": "/layout_dialog.vui"
        }, {
            "start": 3602,
            "audio": 0,
            "end": 228934,
            "filename": "/FiraCode-Regular.ttf"
        }, {
            "start": 228934,
            "audio": 0,
            "end": 233575,
            "filename": "/layout_templates_assetinfo.vui"
        }, {
            "start": 233575,
            "audio": 0,
            "end": 236757,
            "filename": "/layout_dialog_rate_manager.vui"
        }, {
            "start": 236757,
            "audio": 0,
            "end": 236898,
            "filename": "/fontNotoSansThai-Boldcfg.txt"
        }, {
            "start": 236898,
            "audio": 0,
            "end": 244519,
            "filename": "/layout_plot_mode_popup.vui"
        }, {
            "start": 244519,
            "audio": 0,
            "end": 246736,
            "filename": "/layout_automargin_popup.vui"
        }, {
            "start": 246736,
            "audio": 0,
            "end": 247039,
            "filename": "/layout_current_percent.vui"
        }, {
            "start": 247039,
            "audio": 0,
            "end": 252016,
            "filename": "/layout_templates_hint.vui"
        }, {
            "start": 252016,
            "audio": 0,
            "end": 254192,
            "filename": "/layout_dialog_image_list_preview.vui"
        }, {
            "start": 254192,
            "audio": 0,
            "end": 299422,
            "filename": "/layout_templates_deposit_v3.vui"
        }, {
            "start": 299422,
            "audio": 0,
            "end": 307093,
            "filename": "/layout_styles.vui"
        }, {
            "start": 307093,
            "audio": 0,
            "end": 307322,
            "filename": "/layout_simple_hint.vui"
        }, {
            "start": 307322,
            "audio": 0,
            "end": 316631,
            "filename": "/layout_templates_multioption_right_panel.vui"
        }, {
            "start": 316631,
            "audio": 0,
            "end": 318992,
            "filename": "/layout_templates_dashboard.vui"
        }, {
            "start": 318992,
            "audio": 0,
            "end": 338592,
            "filename": "/NotoSansThai-Bold.ttf"
        }, {
            "start": 338592,
            "audio": 0,
            "end": 339991,
            "filename": "/layout_chat_settings_popup.vui"
        }, {
            "start": 339991,
            "audio": 0,
            "end": 341756,
            "filename": "/layout_dialog_marginal_balance.vui"
        }, {
            "start": 341756,
            "audio": 0,
            "end": 357931,
            "filename": "/layout_templates_marginal_forex_right_panel.vui"
        }, {
            "start": 357931,
            "audio": 0,
            "end": 358701,
            "filename": "/layout_micro_buyback_popup.vui"
        }, {
            "start": 358701,
            "audio": 0,
            "end": 361173,
            "filename": "/layout_color_picker_popup.vui"
        }, {
            "start": 361173,
            "audio": 0,
            "end": 364847,
            "filename": "/layout_devel_panel.vui"
        }, {
            "start": 364847,
            "audio": 0,
            "end": 395275,
            "filename": "/layout_template_economic_calendar.vui"
        }, {
            "start": 395275,
            "audio": 0,
            "end": 396228,
            "filename": "/layout_binary_plot_elements.vui"
        }, {
            "start": 396228,
            "audio": 0,
            "end": 403887,
            "filename": "/layout_templates_marginal_forex.vui"
        }, {
            "start": 403887,
            "audio": 0,
            "end": 404016,
            "filename": "/fontrobotothincfg.txt"
        }, {
            "start": 404016,
            "audio": 0,
            "end": 404515,
            "filename": "/layout_manager_cert_hint.vui"
        }, {
            "start": 404515,
            "audio": 0,
            "end": 406466,
            "filename": "/layout_template_leaderboard.vui"
        }, {
            "start": 406466,
            "audio": 0,
            "end": 406578,
            "filename": "/attribute_alias.json"
        }, {
            "start": 406578,
            "audio": 0,
            "end": 408538,
            "filename": "/layout_dialog_tournament_finish.vui"
        }, {
            "start": 408538,
            "audio": 0,
            "end": 409483,
            "filename": "/layout_template_dockpanel_grid.vui"
        }, {
            "start": 409483,
            "audio": 0,
            "end": 412170,
            "filename": "/layout_vip_manager_select_screen.vui"
        }, {
            "start": 412170,
            "audio": 0,
            "end": 422376,
            "filename": "/layout_login.vui"
        }, {
            "start": 422376,
            "audio": 0,
            "end": 453605,
            "filename": "/layout_templates_deposit.vui"
        }, {
            "start": 453605,
            "audio": 0,
            "end": 470305,
            "filename": "/layout_dialog_manager_profile.vui"
        }, {
            "start": 470305,
            "audio": 0,
            "end": 641981,
            "filename": "/default.ttf"
        }, {
            "start": 641981,
            "audio": 0,
            "end": 648309,
            "filename": "/layout_social_profile_popup.vui"
        }, {
            "start": 648309,
            "audio": 0,
            "end": 648961,
            "filename": "/layout_devel_panel_ab_feature.vui"
        }, {
            "start": 648961,
            "audio": 0,
            "end": 649849,
            "filename": "/layout_dialog_blockclient.vui"
        }, {
            "start": 649849,
            "audio": 0,
            "end": 869697,
            "filename": "/NotoSansDevanagari-Bold.ttf"
        }, {
            "start": 869697,
            "audio": 0,
            "end": 878702,
            "filename": "/layout_templates_digital_strikes.vui"
        }, {
            "start": 878702,
            "audio": 0,
            "end": 880059,
            "filename": "/layout_plot_timescale.vui"
        }, {
            "start": 880059,
            "audio": 0,
            "end": 886433,
            "filename": "/layout_templates_portfolio.vui"
        }, {
            "start": 886433,
            "audio": 0,
            "end": 896370,
            "filename": "/layout_templates_timer.vui"
        }, {
            "start": 896370,
            "audio": 0,
            "end": 897730,
            "filename": "/layout_digital_timescale.vui"
        }, {
            "start": 897730,
            "audio": 0,
            "end": 898356,
            "filename": "/layout_cfd_profit_indicator.vui"
        }, {
            "start": 898356,
            "audio": 0,
            "end": 899209,
            "filename": "/layout_dialog_prize_distrib.vui"
        }, {
            "start": 899209,
            "audio": 0,
            "end": 904333,
            "filename": "/layout_templates_iq_dialogs.vui"
        }, {
            "start": 904333,
            "audio": 0,
            "end": 920053,
            "filename": "/effects_runtime.lua"
        }, {
            "start": 920053,
            "audio": 0,
            "end": 932984,
            "filename": "/layout_option_right_panel.vui"
        }, {
            "start": 932984,
            "audio": 0,
            "end": 946967,
            "filename": "/layout_templates_tabcontrol.vui"
        }, {
            "start": 946967,
            "audio": 0,
            "end": 947441,
            "filename": "/layout_dialog_change_balance.vui"
        }, {
            "start": 947441,
            "audio": 0,
            "end": 1137965,
            "filename": "/NotoSansBengali-Regular.ttf"
        }, {
            "start": 1137965,
            "audio": 0,
            "end": 1138096,
            "filename": "/fontdefaultcfg.txt"
        }, {
            "start": 1138096,
            "audio": 0,
            "end": 1141789,
            "filename": "/layout_templates_alerts.vui"
        }, {
            "start": 1141789,
            "audio": 0,
            "end": 1160621,
            "filename": "/layout_templates_otn.vui"
        }, {
            "start": 1160621,
            "audio": 0,
            "end": 1179418,
            "filename": "/layout_templates_balances.vui"
        }, {
            "start": 1179418,
            "audio": 0,
            "end": 1180304,
            "filename": "/layout_notify_crypto_calendar.vui"
        }, {
            "start": 1180304,
            "audio": 0,
            "end": 1183714,
            "filename": "/ui_effects.lua"
        }, {
            "start": 1183714,
            "audio": 0,
            "end": 1186402,
            "filename": "/layout_dialog_overnight.vui"
        }, {
            "start": 1186402,
            "audio": 0,
            "end": 1187122,
            "filename": "/layout_template_textbuttonsolid.vui"
        }, {
            "start": 1187122,
            "audio": 0,
            "end": 1199973,
            "filename": "/resconfig.lua"
        }, {
            "start": 1199973,
            "audio": 0,
            "end": 1203109,
            "filename": "/layout_digital_plot_elements.vui"
        }, {
            "start": 1203109,
            "audio": 0,
            "end": 1204812,
            "filename": "/emoji_font.cfg"
        }, {
            "start": 1204812,
            "audio": 0,
            "end": 1242300,
            "filename": "/layout_templates_deposit_v4.vui"
        }, {
            "start": 1242300,
            "audio": 0,
            "end": 1243995,
            "filename": "/layout_big_buyback_popup.vui"
        }, {
            "start": 1243995,
            "audio": 0,
            "end": 1252715,
            "filename": "/layout_templates_market_analysis.vui"
        }, {
            "start": 1252715,
            "audio": 0,
            "end": 1254323,
            "filename": "/layout_template_week_selector.vui"
        }, {
            "start": 1254323,
            "audio": 0,
            "end": 1270574,
            "filename": "/layout_templates_exchange.vui"
        }, {
            "start": 1270574,
            "audio": 0,
            "end": 1274205,
            "filename": "/layout_dialog_email_activation.vui"
        }, {
            "start": 1274205,
            "audio": 0,
            "end": 1274385,
            "filename": "/layout_templates_frame.vui"
        }, {
            "start": 1274385,
            "audio": 0,
            "end": 1274528,
            "filename": "/fontNotoSansThai-Regularcfg.txt"
        }, {
            "start": 1274528,
            "audio": 0,
            "end": 1275222,
            "filename": "/layout_template_iconhotkey.vui"
        }, {
            "start": 1275222,
            "audio": 0,
            "end": 1317265,
            "filename": "/layout_templates_notifications.vui"
        }, {
            "start": 1317265,
            "audio": 0,
            "end": 1391533,
            "filename": "/layout_templates_cfd.vui"
        }, {
            "start": 1391533,
            "audio": 0,
            "end": 1393330,
            "filename": "/layout_templates_bar.vui"
        }, {
            "start": 1393330,
            "audio": 0,
            "end": 1393345,
            "filename": "/fontFiraCode-Regularcfg.txt"
        }, {
            "start": 1393345,
            "audio": 0,
            "end": 1394700,
            "filename": "/layout_traders_choice.vui"
        }, {
            "start": 1394700,
            "audio": 0,
            "end": 1400893,
            "filename": "/layout_orderbook.vui"
        }, {
            "start": 1400893,
            "audio": 0,
            "end": 1401429,
            "filename": "/layout_template_amountbutton.vui"
        }, {
            "start": 1401429,
            "audio": 0,
            "end": 1403813,
            "filename": "/layout_dialog_indicator.vui"
        }, {
            "start": 1403813,
            "audio": 0,
            "end": 1403828,
            "filename": "/test.txt"
        }, {
            "start": 1403828,
            "audio": 0,
            "end": 1404343,
            "filename": "/layout_color_picker_simple_popup.vui"
        }, {
            "start": 1404343,
            "audio": 0,
            "end": 1409408,
            "filename": "/layout_first_notify_otn.vui"
        }, {
            "start": 1409408,
            "audio": 0,
            "end": 1409950,
            "filename": "/layout_templates_hi_lo.vui"
        }, {
            "start": 1409950,
            "audio": 0,
            "end": 1411916,
            "filename": "/layout_partial_close_popup.vui"
        }, {
            "start": 1411916,
            "audio": 0,
            "end": 1412613,
            "filename": "/layout_hint_frame_error.vui"
        }, {
            "start": 1412613,
            "audio": 0,
            "end": 1428836,
            "filename": "/layout_templates_news.vui"
        }, {
            "start": 1428836,
            "audio": 0,
            "end": 1431936,
            "filename": "/layout_plot_tools_panel.vui"
        }, {
            "start": 1431936,
            "audio": 0,
            "end": 1432065,
            "filename": "/fontNotoSansDevanagari-Regularcfg.txt"
        }, {
            "start": 1432065,
            "audio": 0,
            "end": 1888045,
            "filename": "/thaidictionary.txt"
        }, {
            "start": 1888045,
            "audio": 0,
            "end": 1893410,
            "filename": "/layout_templates_welcome_popup.vui"
        }, {
            "start": 1893410,
            "audio": 0,
            "end": 1899676,
            "filename": "/layout_templates_dialog_indicator.vui"
        }, {
            "start": 1899676,
            "audio": 0,
            "end": 2070096,
            "filename": "/robotothin.ttf"
        }, {
            "start": 2070096,
            "audio": 0,
            "end": 2078071,
            "filename": "/layout_common_plot_elements.vui"
        }, {
            "start": 2078071,
            "audio": 0,
            "end": 2079814,
            "filename": "/layout_big_orders_popup.vui"
        }, {
            "start": 2079814,
            "audio": 0,
            "end": 2080900,
            "filename": "/layout_dialog_gdpr.vui"
        }, {
            "start": 2080900,
            "audio": 0,
            "end": 2084396,
            "filename": "/layout_templates_videoplayer.vui"
        }, {
            "start": 2084396,
            "audio": 0,
            "end": 2090515,
            "filename": "/layout_templates_forex_filter.vui"
        }, {
            "start": 2090515,
            "audio": 0,
            "end": 2134048,
            "filename": "/layout_main.vui"
        }, {
            "start": 2134048,
            "audio": 0,
            "end": 2134674,
            "filename": "/layout_dialog_balance_not_enough.vui"
        }, {
            "start": 2134674,
            "audio": 0,
            "end": 2139491,
            "filename": "/layout_leftpanel_open_deals.vui"
        }, {
            "start": 2139491,
            "audio": 0,
            "end": 2189182,
            "filename": "/layout_templates_assetprofile.vui"
        }, {
            "start": 2189182,
            "audio": 0,
            "end": 2192127,
            "filename": "/layout_templates_exp_balloon.vui"
        }, {
            "start": 2192127,
            "audio": 0,
            "end": 2224539,
            "filename": "/canvas_effects.lua"
        }, {
            "start": 2224539,
            "audio": 0,
            "end": 2241022,
            "filename": "/layout_templates_expirations.vui"
        }, {
            "start": 2241022,
            "audio": 0,
            "end": 2527721,
            "filename": "/emoji_descriptor.json"
        }, {
            "start": 2527721,
            "audio": 0,
            "end": 2528569,
            "filename": "/layout_templates_slider.vui"
        }, {
            "start": 2528569,
            "audio": 0,
            "end": 2529311,
            "filename": "/layout_hint_frame.vui"
        }, {
            "start": 2529311,
            "audio": 0,
            "end": 2539546,
            "filename": "/layout_templates_manager.vui"
        }, {
            "start": 2539546,
            "audio": 0,
            "end": 2542390,
            "filename": "/layout_small_buyback_popup.vui"
        }, {
            "start": 2542390,
            "audio": 0,
            "end": 2570484,
            "filename": "/layout_templates_common.vui"
        }, {
            "start": 2570484,
            "audio": 0,
            "end": 2572650,
            "filename": "/layout_templates_tabpanel.vui"
        }, {
            "start": 2572650,
            "audio": 0,
            "end": 2573124,
            "filename": "/layout_time_to_open_asset.vui"
        }, {
            "start": 2573124,
            "audio": 0,
            "end": 2578280,
            "filename": "/layout_client_category_popup.vui"
        }, {
            "start": 2578280,
            "audio": 0,
            "end": 2579323,
            "filename": "/layout_dialog_left_panel.vui"
        }, {
            "start": 2579323,
            "audio": 0,
            "end": 2580517,
            "filename": "/layout_chat_rules.vui"
        }, {
            "start": 2580517,
            "audio": 0,
            "end": 2584162,
            "filename": "/layout_dialog_webviewer.vui"
        }, {
            "start": 2584162,
            "audio": 0,
            "end": 2584525,
            "filename": "/layout_dialog_tournament_reg.vui"
        }, {
            "start": 2584525,
            "audio": 0,
            "end": 2586001,
            "filename": "/layout_web32bits_browser.vui"
        }, {
            "start": 2586001,
            "audio": 0,
            "end": 2586988,
            "filename": "/layout_dialog_confirmhighrisk.vui"
        }, {
            "start": 2586988,
            "audio": 0,
            "end": 2587117,
            "filename": "/fontNotoSansBengali-Regularcfg.txt"
        }, {
            "start": 2587117,
            "audio": 0,
            "end": 2587332,
            "filename": "/layout_template_hintwithicon.vui"
        }, {
            "start": 2587332,
            "audio": 0,
            "end": 2588669,
            "filename": "/layout_dialog_buy_confirm.vui"
        }, {
            "start": 2588669,
            "audio": 0,
            "end": 2590500,
            "filename": "/layout_plot_tab.vui"
        }, {
            "start": 2590500,
            "audio": 0,
            "end": 2590629,
            "filename": "/fontNotoSansDevanagari-Boldcfg.txt"
        }, {
            "start": 2590629,
            "audio": 0,
            "end": 2591572,
            "filename": "/layout_templates_plot_panel.vui"
        }, {
            "start": 2591572,
            "audio": 0,
            "end": 2594667,
            "filename": "/layout_dialog_selectaccount.vui"
        }, {
            "start": 2594667,
            "audio": 0,
            "end": 2658618,
            "filename": "/layout_templates_iq.vui"
        }, {
            "start": 2658618,
            "audio": 0,
            "end": 2669443,
            "filename": "/layout_templates_amountselector.vui"
        }, {
            "start": 2669443,
            "audio": 0,
            "end": 2840203,
            "filename": "/robotobold.ttf"
        }, {
            "start": 2840203,
            "audio": 0,
            "end": 2844215,
            "filename": "/layout_contact_support_status_bar.vui"
        }, {
            "start": 2844215,
            "audio": 0,
            "end": 2845028,
            "filename": "/layout_template_textbutton.vui"
        }, {
            "start": 2845028,
            "audio": 0,
            "end": 2845856,
            "filename": "/layout_orderbook_history.vui"
        }, {
            "start": 2845856,
            "audio": 0,
            "end": 2846624,
            "filename": "/layout_indicators_welcome_popup.vui"
        }, {
            "start": 2846624,
            "audio": 0,
            "end": 2846753,
            "filename": "/fontNotoSansBengali-Boldcfg.txt"
        }, {
            "start": 2846753,
            "audio": 0,
            "end": 2847111,
            "filename": "/layout_top_logo.vui"
        }, {
            "start": 2847111,
            "audio": 0,
            "end": 2847931,
            "filename": "/layout_template_onlytextbutton.vui"
        }, {
            "start": 2847931,
            "audio": 0,
            "end": 2920387,
            "filename": "/atlasses.json"
        }, {
            "start": 2920387,
            "audio": 0,
            "end": 2946347,
            "filename": "/layout_templates_chat.vui"
        }, {
            "start": 2946347,
            "audio": 0,
            "end": 3159087,
            "filename": "/NotoSansDevanagari-Regular.ttf"
        }, {
            "start": 3159087,
            "audio": 0,
            "end": 3227826,
            "filename": "/layout_templates_iq_leftpanel.vui"
        }, {
            "start": 3227826,
            "audio": 0,
            "end": 3427186,
            "filename": "/NotoSansBengali-Bold.ttf"
        }, {
            "start": 3427186,
            "audio": 0,
            "end": 3430212,
            "filename": "/layout_dialog_edit_alert.vui"
        }, {
            "start": 3430212,
            "audio": 0,
            "end": 3437131,
            "filename": "/layout_templates_notifications_tpsl.vui"
        }, {
            "start": 3437131,
            "audio": 0,
            "end": 3438103,
            "filename": "/layout_template_hotkey.vui"
        }, {
            "start": 3438103,
            "audio": 0,
            "end": 3439118,
            "filename": "/layout_templates_live_deals.vui"
        }, {
            "start": 3439118,
            "audio": 0,
            "end": 3449767,
            "filename": "/layout_withdraw_crypto.vui"
        }, {
            "start": 3449767,
            "audio": 0,
            "end": 3449824,
            "filename": "/layout_dialog_news.vui"
        }, {
            "start": 3449824,
            "audio": 0,
            "end": 3454114,
            "filename": "/layout_templates_quantityselector.vui"
        }, {
            "start": 3454114,
            "audio": 0,
            "end": 3477395,
            "filename": "/layout_templates_picker.vui"
        }, {
            "start": 3477395,
            "audio": 0,
            "end": 3478605,
            "filename": "/layout_price_movement.vui"
        }, {
            "start": 3478605,
            "audio": 0,
            "end": 3478734,
            "filename": "/fontrobotoboldcfg.txt"
        }, {
            "start": 3478734,
            "audio": 0,
            "end": 3501378,
            "filename": "/NotoSansThai-Regular.ttf"
        }, {
            "start": 3501378,
            "audio": 0,
            "end": 3501538,
            "filename": "/styles/themes.json"
        }, {
            "start": 3501538,
            "audio": 0,
            "end": 3525244,
            "filename": "/styles/global.css"
        }, {
            "start": 3525244,
            "audio": 0,
            "end": 3536467,
            "filename": "/styles/themes/black.css"
        }, {
            "start": 3536467,
            "audio": 0,
            "end": 3547846,
            "filename": "/styles/themes/blue.css"
        }, {
            "start": 3547846,
            "audio": 0,
            "end": 3559108,
            "filename": "/styles/themes/white.css"
        }, {
            "start": 3559108,
            "audio": 0,
            "end": 3570394,
            "filename": "/styles/themes/grey.css"
        }, {
            "start": 3570394,
            "audio": 0,
            "end": 3570779,
            "filename": "/ani_connection_logo/ani_connection_logo.json"
        }, {
            "start": 3570779,
            "audio": 0,
            "end": 3591481,
            "filename": "/indicators/lib.json.gz"
        }, {
            "start": 3591481,
            "audio": 0,
            "end": 3591737,
            "filename": "/shaders/glsl100es/uvclip.vshader"
        }, {
            "start": 3591737,
            "audio": 0,
            "end": 3592214,
            "filename": "/shaders/glsl100es/hsv_palette.fshader"
        }, {
            "start": 3592214,
            "audio": 0,
            "end": 3592518,
            "filename": "/shaders/glsl100es/texture_only.fshader"
        }, {
            "start": 3592518,
            "audio": 0,
            "end": 3592777,
            "filename": "/shaders/glsl100es/path_stroke.vshader"
        }, {
            "start": 3592777,
            "audio": 0,
            "end": 3593072,
            "filename": "/shaders/glsl100es/dual_texturing_mask.fshader"
        }, {
            "start": 3593072,
            "audio": 0,
            "end": 3593767,
            "filename": "/shaders/glsl100es/yuv.fshader"
        }, {
            "start": 3593767,
            "audio": 0,
            "end": 3595418,
            "filename": "/shaders/glsl100es/blur.vshader"
        }, {
            "start": 3595418,
            "audio": 0,
            "end": 3596526,
            "filename": "/shaders/glsl100es/path_stroke.fshader"
        }, {
            "start": 3596526,
            "audio": 0,
            "end": 3596660,
            "filename": "/shaders/glsl100es/color_only.fshader"
        }, {
            "start": 3596660,
            "audio": 0,
            "end": 3597670,
            "filename": "/shaders/glsl100es/blur.fshader"
        }, {
            "start": 3597670,
            "audio": 0,
            "end": 3597919,
            "filename": "/shaders/glsl100es/vertex_color_only.fshader"
        }, {
            "start": 3597919,
            "audio": 0,
            "end": 3598168,
            "filename": "/shaders/glsl100es/qr.fshader"
        }, {
            "start": 3598168,
            "audio": 0,
            "end": 3598631,
            "filename": "/shaders/glsl100es/color_blend.fshader"
        }, {
            "start": 3598631,
            "audio": 0,
            "end": 3599198,
            "filename": "/shaders/glsl100es/default.vshader"
        }, {
            "start": 3599198,
            "audio": 0,
            "end": 3599515,
            "filename": "/shaders/glsl100es/alpha_set.fshader"
        }, {
            "start": 3599515,
            "audio": 0,
            "end": 3599722,
            "filename": "/shaders/glsl100es/uvclip.fshader"
        }, {
            "start": 3599722,
            "audio": 0,
            "end": 3599816,
            "filename": "/shaders/glsl100es/path_fill.fshader"
        }, {
            "start": 3599816,
            "audio": 0,
            "end": 3600090,
            "filename": "/shaders/glsl100es/color_add.fshader"
        }, {
            "start": 3600090,
            "audio": 0,
            "end": 3600392,
            "filename": "/shaders/glsl100es/color_mul.fshader"
        }, {
            "start": 3600392,
            "audio": 0,
            "end": 3600653,
            "filename": "/shaders/glsl100es/mul_alpha.fshader"
        }, {
            "start": 3600653,
            "audio": 0,
            "end": 3600832,
            "filename": "/shaders/glsl100es/path_fill.vshader"
        }, {
            "start": 3600832,
            "audio": 0,
            "end": 3601845,
            "filename": "/layouts/modelview_templates.vui"
        }, {
            "start": 3601845,
            "audio": 0,
            "end": 3602841,
            "filename": "/layouts/layout_unlink_oneClick_confirm_popup.vui"
        }, {
            "start": 3602841,
            "audio": 0,
            "end": 3606012,
            "filename": "/layouts/templates_list.json"
        }, {
            "start": 3606012,
            "audio": 0,
            "end": 3609603,
            "filename": "/layouts/news_on_plot.vui"
        }, {
            "start": 3609603,
            "audio": 0,
            "end": 3615296,
            "filename": "/layouts/alerts_layouts.vui"
        }, {
            "start": 3615296,
            "audio": 0,
            "end": 3626630,
            "filename": "/layouts/templates_indicator_scripted.vui"
        }, {
            "start": 3626630,
            "audio": 0,
            "end": 3628700,
            "filename": "/layouts/dialog_indicator_scripted.vui"
        }, {
            "start": 3628700,
            "audio": 0,
            "end": 3630074,
            "filename": "/layouts/customDialogs/defaultExchangeMode.vui"
        }, {
            "start": 3630074,
            "audio": 0,
            "end": 3631329,
            "filename": "/layouts/customDialogs/viewKYCRequirement.vui"
        }, {
            "start": 3631329,
            "audio": 0,
            "end": 3636218,
            "filename": "/layouts/customDialogs/viewDeletedAccount.vui"
        }, {
            "start": 3636218,
            "audio": 0,
            "end": 3637677,
            "filename": "/layouts/customDialogs/chooseDigitalsType.vui"
        }, {
            "start": 3637677,
            "audio": 0,
            "end": 3645433,
            "filename": "/layouts/heap/heap.vui"
        }, {
            "start": 3645433,
            "audio": 0,
            "end": 3652678,
            "filename": "/layouts/VideoEducation/video_education_leftpanel.vui"
        }, {
            "start": 3652678,
            "audio": 0,
            "end": 3652761,
            "filename": "/layouts/VideoEducation/video_education_player.vui"
        }, {
            "start": 3652761,
            "audio": 0,
            "end": 3656452,
            "filename": "/layouts/leftPanel/welcomeToDo.vui"
        }, {
            "start": 3656452,
            "audio": 0,
            "end": 3663633,
            "filename": "/layouts/leftPanel/leftPanelMenu.vui"
        }, {
            "start": 3663633,
            "audio": 0,
            "end": 3670132,
            "filename": "/layouts/settings/settings_privacy.vui"
        }, {
            "start": 3670132,
            "audio": 0,
            "end": 3673640,
            "filename": "/layouts/settings/settings_hotkeys_osx.vui"
        }, {
            "start": 3673640,
            "audio": 0,
            "end": 3676835,
            "filename": "/layouts/settings/settings_about.vui"
        }, {
            "start": 3676835,
            "audio": 0,
            "end": 3680963,
            "filename": "/layouts/settings/settings_notifications.vui"
        }, {
            "start": 3680963,
            "audio": 0,
            "end": 3689526,
            "filename": "/layouts/settings/settings_trading.vui"
        }, {
            "start": 3689526,
            "audio": 0,
            "end": 3699077,
            "filename": "/layouts/settings/settings_basic.vui"
        }, {
            "start": 3699077,
            "audio": 0,
            "end": 3706957,
            "filename": "/layouts/settings/settings_dialog.vui"
        }, {
            "start": 3706957,
            "audio": 0,
            "end": 3710568,
            "filename": "/layouts/settings/settings_hotkeys.vui"
        }, {
            "start": 3710568,
            "audio": 0,
            "end": 3711822,
            "filename": "/layouts/mobile/mobile_download_app.vui"
        }, {
            "start": 3711822,
            "audio": 0,
            "end": 3712999,
            "filename": "/layouts/mobile/mobile_homescreen.vui"
        }, {
            "start": 3712999,
            "audio": 0,
            "end": 3713351,
            "filename": "/layouts/mobile/mobile_basic.vui"
        }, {
            "start": 3713351,
            "audio": 0,
            "end": 3732660,
            "filename": "/layouts/balances/new_balances.vui"
        }, {
            "start": 3732660,
            "audio": 0,
            "end": 3735822,
            "filename": "/layouts/tradingHistory/trading_history_leftpanel.vui"
        }, {
            "start": 3735822,
            "audio": 0,
            "end": 3737270,
            "filename": "/layouts/activeSelector/active_selector_left_part.vui"
        }, {
            "start": 3737270,
            "audio": 0,
            "end": 3743981,
            "filename": "/layouts/activeSelector/layout_active_selector.vui"
        }, {
            "start": 3743981,
            "audio": 0,
            "end": 3752734,
            "filename": "/layouts/activeSelector/active_selector_category_item.vui"
        }, {
            "start": 3752734,
            "audio": 0,
            "end": 3753794,
            "filename": "/layouts/activeSelector/active_selector_search.vui"
        }, {
            "start": 3753794,
            "audio": 0,
            "end": 3754074,
            "filename": "/portfolio/fullscreen_portfolio.css"
        }, {
            "start": 3754074,
            "audio": 0,
            "end": 3754423,
            "filename": "/portfolio/layout_fullscreen_column_settings.vui"
        }, {
            "start": 3754423,
            "audio": 0,
            "end": 3754922,
            "filename": "/portfolio/layout_fullscreen_group_closeall.vui"
        }, {
            "start": 3754922,
            "audio": 0,
            "end": 3759703,
            "filename": "/portfolio/bottom_portfolio.css"
        }, {
            "start": 3759703,
            "audio": 0,
            "end": 3760119,
            "filename": "/portfolio/layout_fullscreen_group_invest.vui"
        }, {
            "start": 3760119,
            "audio": 0,
            "end": 3760948,
            "filename": "/portfolio/layout_leftpanel_portfolio_filter.vui"
        }, {
            "start": 3760948,
            "audio": 0,
            "end": 3767224,
            "filename": "/portfolio/layout_leftpanel_portfolio_order_item.vui"
        }, {
            "start": 3767224,
            "audio": 0,
            "end": 3767509,
            "filename": "/portfolio/layout_fullscreen_deal_time.vui"
        }, {
            "start": 3767509,
            "audio": 0,
            "end": 3768157,
            "filename": "/portfolio/layout_fullscreen_deal_asset.vui"
        }, {
            "start": 3768157,
            "audio": 0,
            "end": 3768436,
            "filename": "/portfolio/layout_fullscreen_group_profit.vui"
        }, {
            "start": 3768436,
            "audio": 0,
            "end": 3769201,
            "filename": "/portfolio/layout_fullscreen_column_profit.vui"
        }, {
            "start": 3769201,
            "audio": 0,
            "end": 3769942,
            "filename": "/portfolio/layout_fullscreen_column_equity.vui"
        }, {
            "start": 3769942,
            "audio": 0,
            "end": 3772254,
            "filename": "/portfolio/layout_fullscreen_group_asset.vui"
        }, {
            "start": 3772254,
            "audio": 0,
            "end": 3772547,
            "filename": "/portfolio/layout_fullscreen_deal_profit.vui"
        }, {
            "start": 3772547,
            "audio": 0,
            "end": 3773001,
            "filename": "/portfolio/layout_fullscreen_deal_invest.vui"
        }, {
            "start": 3773001,
            "audio": 0,
            "end": 3775697,
            "filename": "/portfolio/layout_leftpanel_portfolio.vui"
        }, {
            "start": 3775697,
            "audio": 0,
            "end": 3776398,
            "filename": "/portfolio/layout_fullscreen_column_invest.vui"
        }, {
            "start": 3776398,
            "audio": 0,
            "end": 3776920,
            "filename": "/portfolio/layout_fullscreen_portfolio.vui"
        }, {
            "start": 3776920,
            "audio": 0,
            "end": 3777857,
            "filename": "/portfolio/layout_leftpanel_portfolio_pnl.vui"
        }, {
            "start": 3777857,
            "audio": 0,
            "end": 3779944,
            "filename": "/portfolio/layout_leftpanel_portfolio_item.vui"
        }, {
            "start": 3779944,
            "audio": 0,
            "end": 3780897,
            "filename": "/portfolio/left_portfolio.css"
        }, {
            "start": 3780897,
            "audio": 0,
            "end": 3781769,
            "filename": "/portfolio/layout_fullscreen_deal_close.vui"
        }, {
            "start": 3781769,
            "audio": 0,
            "end": 3786225,
            "filename": "/portfolio/layout_bottompanel_portfolio.vui"
        }, {
            "start": 3786225,
            "audio": 0,
            "end": 3795472,
            "filename": "/portfolio/layout_bottompanel_portfolio_templates.vui"
        }, {
            "start": 3795472,
            "audio": 0,
            "end": 3795765,
            "filename": "/portfolio/layout_fullscreen_deal_equity.vui"
        }, {
            "start": 3795765,
            "audio": 0,
            "end": 3796325,
            "filename": "/portfolio/layout_fullscreen_column_asset.vui"
        }, {
            "start": 3796325,
            "audio": 0,
            "end": 3800412,
            "filename": "/portfolio/layout_leftpanel_portfolio_single_deal.vui"
        }, {
            "start": 3800412,
            "audio": 0,
            "end": 3800803,
            "filename": "/portfolio/layout_fullscreen_group_opentime.vui"
        }, {
            "start": 3800803,
            "audio": 0,
            "end": 3801231,
            "filename": "/portfolio/layout_fullscreen_column_time.vui"
        }, {
            "start": 3801231,
            "audio": 0,
            "end": 3801510,
            "filename": "/portfolio/layout_fullscreen_group_equity.vui"
        }, {
            "start": 3801510,
            "audio": 0,
            "end": 3803328,
            "filename": "/portfolio/layout_leftpanel_portfolio_timer_group.vui"
        }, {
            "start": 3803328,
            "audio": 0,
            "end": 3807324,
            "filename": "/portfolio/layout_leftpanel_portfolio_multiple_deal.vui"
        }, {
            "start": 3807324,
            "audio": 0,
            "end": 3807709,
            "filename": "/ani_trash/ani_trash.json"
        }],
        "remote_package_size": 3807709,
        "package_uuid": "fbfed859-e26d-45b0-9b0d-f877a87341fa"
    })
})();
var moduleOverrides = {};
var key;
for (key in Module) {
    if (Module.hasOwnProperty(key)) {
        moduleOverrides[key] = Module[key]
    }
}
var arguments_ = [];
var thisProgram = "./this.program";
var quit_ = function(status, toThrow) {
    throw toThrow
};
var ENVIRONMENT_IS_WEB = false;
var ENVIRONMENT_IS_WORKER = false;
var ENVIRONMENT_IS_NODE = false;
var ENVIRONMENT_HAS_NODE = false;
var ENVIRONMENT_IS_SHELL = false;
ENVIRONMENT_IS_WEB = typeof window === "object";
ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
ENVIRONMENT_HAS_NODE = typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";
ENVIRONMENT_IS_NODE = ENVIRONMENT_HAS_NODE && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
var scriptDirectory = "";

function locateFile(path) {
    if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory)
    }
    return scriptDirectory + path
}
var read_, readAsync, readBinary, setWindowTitle;
if (ENVIRONMENT_IS_NODE) {
    scriptDirectory = __dirname + "/";
    var nodeFS;
    var nodePath;
    read_ = function shell_read(filename, binary) {
        var ret;
        if (!nodeFS) nodeFS = require("fs");
        if (!nodePath) nodePath = require("path");
        filename = nodePath["normalize"](filename);
        ret = nodeFS["readFileSync"](filename);
        return binary ? ret : ret.toString()
    };
    readBinary = function readBinary(filename) {
        var ret = read_(filename, true);
        if (!ret.buffer) {
            ret = new Uint8Array(ret)
        }
        assert(ret.buffer);
        return ret
    };
    if (process["argv"].length > 1) {
        thisProgram = process["argv"][1].replace(/\\/g, "/")
    }
    arguments_ = process["argv"].slice(2);
    if (typeof module !== "undefined") {
        module["exports"] = Module
    }
    process["on"]("uncaughtException", function(ex) {
        if (!(ex instanceof ExitStatus)) {
            throw ex
        }
    });
    process["on"]("unhandledRejection", abort);
    quit_ = function(status) {
        process["exit"](status)
    };
    Module["inspect"] = function() {
        return "[Emscripten Module object]"
    }
} else if (ENVIRONMENT_IS_SHELL) {
    if (typeof read != "undefined") {
        read_ = function shell_read(f) {
            return read(f)
        }
    }
    readBinary = function readBinary(f) {
        var data;
        if (typeof readbuffer === "function") {
            return new Uint8Array(readbuffer(f))
        }
        data = read(f, "binary");
        assert(typeof data === "object");
        return data
    };
    if (typeof scriptArgs != "undefined") {
        arguments_ = scriptArgs
    } else if (typeof arguments != "undefined") {
        arguments_ = arguments
    }
    if (typeof quit === "function") {
        quit_ = function(status) {
            quit(status)
        }
    }
    if (typeof print !== "undefined") {
        if (typeof console === "undefined") console = {};
        console.log = print;
        console.warn = console.error = typeof printErr !== "undefined" ? printErr : print
    }
} else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
    if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href
    } else if (document.currentScript) {
        scriptDirectory = document.currentScript.src
    }
    if (scriptDirectory.indexOf("blob:") !== 0) {
        scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1)
    } else {
        scriptDirectory = ""
    }
    read_ = function shell_read(url) {
        var xhr = new XMLHttpRequest;
        xhr.open("GET", url, false);
        xhr.send(null);
        return xhr.responseText
    };
    if (ENVIRONMENT_IS_WORKER) {
        readBinary = function readBinary(url) {
            var xhr = new XMLHttpRequest;
            xhr.open("GET", url, false);
            xhr.responseType = "arraybuffer";
            xhr.send(null);
            return new Uint8Array(xhr.response)
        }
    }
    readAsync = function readAsync(url, onload, onerror) {
        var xhr = new XMLHttpRequest;
        xhr.open("GET", url, true);
        xhr.responseType = "arraybuffer";
        xhr.onload = function xhr_onload() {
            if (xhr.status == 200 || xhr.status == 0 && xhr.response) {
                onload(xhr.response);
                return
            }
            onerror()
        };
        xhr.onerror = onerror;
        xhr.send(null)
    };
    setWindowTitle = function(title) {
        document.title = title
    }
} else {}
var out = Module["print"] || console.log.bind(console);
var err = Module["printErr"] || console.warn.bind(console);
for (key in moduleOverrides) {
    if (moduleOverrides.hasOwnProperty(key)) {
        Module[key] = moduleOverrides[key]
    }
}
moduleOverrides = null;
if (Module["arguments"]) arguments_ = Module["arguments"];
if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
if (Module["quit"]) quit_ = Module["quit"];

function dynamicAlloc(size) {
    var ret = HEAP32[DYNAMICTOP_PTR >> 2];
    var end = ret + size + 15 & -16;
    if (end > _emscripten_get_heap_size()) {
        abort()
    }
    HEAP32[DYNAMICTOP_PTR >> 2] = end;
    return ret
}

function getNativeTypeSize(type) {
    switch (type) {
        case "i1":
        case "i8":
            return 1;
        case "i16":
            return 2;
        case "i32":
            return 4;
        case "i64":
            return 8;
        case "float":
            return 4;
        case "double":
            return 8;
        default:
            {
                if (type[type.length - 1] === "*") {
                    return 4
                } else if (type[0] === "i") {
                    var bits = parseInt(type.substr(1));
                    assert(bits % 8 === 0, "getNativeTypeSize invalid bits " + bits + ", type " + type);
                    return bits / 8
                } else {
                    return 0
                }
            }
    }
}

function warnOnce(text) {
    if (!warnOnce.shown) warnOnce.shown = {};
    if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        err(text)
    }
}
var asm2wasmImports = {
    "f64-rem": function(x, y) {
        return x % y
    },
    "debugger": function() {}
};
var functionPointers = new Array(0);

function dynCall(sig, ptr, args) {
    if (args && args.length) {
        return Module["dynCall_" + sig].apply(null, [ptr].concat(args))
    } else {
        return Module["dynCall_" + sig].call(null, ptr)
    }
}
var tempRet0 = 0;
var setTempRet0 = function(value) {
    tempRet0 = value
};
var getTempRet0 = function() {
    return tempRet0
};
var wasmBinary;
if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
var noExitRuntime;
if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
if (typeof WebAssembly !== "object") {
    err("no native wasm support detected")
}

function setValue(ptr, value, type, noSafe) {
    type = type || "i8";
    if (type.charAt(type.length - 1) === "*") type = "i32";
    switch (type) {
        case "i1":
            HEAP8[ptr >> 0] = value;
            break;
        case "i8":
            HEAP8[ptr >> 0] = value;
            break;
        case "i16":
            HEAP16[ptr >> 1] = value;
            break;
        case "i32":
            HEAP32[ptr >> 2] = value;
            break;
        case "i64":
            tempI64 = [value >>> 0, (tempDouble = value, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[ptr >> 2] = tempI64[0], HEAP32[ptr + 4 >> 2] = tempI64[1];
            break;
        case "float":
            HEAPF32[ptr >> 2] = value;
            break;
        case "double":
            HEAPF64[ptr >> 3] = value;
            break;
        default:
            abort("invalid type for setValue: " + type)
    }
}
var wasmMemory;
var wasmTable = new WebAssembly.Table({
    "initial": 54366,
    "maximum": 54366,
    "element": "anyfunc"
});
var ABORT = false;
var EXITSTATUS = 0;

function assert(condition, text) {
    if (!condition) {
        abort("Assertion failed: " + text)
    }
}
var ALLOC_NORMAL = 0;
var ALLOC_NONE = 3;

function allocate(slab, types, allocator, ptr) {
    var zeroinit, size;
    if (typeof slab === "number") {
        zeroinit = true;
        size = slab
    } else {
        zeroinit = false;
        size = slab.length
    }
    var singleType = typeof types === "string" ? types : null;
    var ret;
    if (allocator == ALLOC_NONE) {
        ret = ptr
    } else {
        ret = [_malloc, stackAlloc, dynamicAlloc][allocator](Math.max(size, singleType ? 1 : types.length))
    }
    if (zeroinit) {
        var stop;
        ptr = ret;
        assert((ret & 3) == 0);
        stop = ret + (size & ~3);
        for (; ptr < stop; ptr += 4) {
            HEAP32[ptr >> 2] = 0
        }
        stop = ret + size;
        while (ptr < stop) {
            HEAP8[ptr++ >> 0] = 0
        }
        return ret
    }
    if (singleType === "i8") {
        if (slab.subarray || slab.slice) {
            HEAPU8.set(slab, ret)
        } else {
            HEAPU8.set(new Uint8Array(slab), ret)
        }
        return ret
    }
    var i = 0,
        type, typeSize, previousType;
    while (i < size) {
        var curr = slab[i];
        type = singleType || types[i];
        if (type === 0) {
            i++;
            continue
        }
        if (type == "i64") type = "i32";
        setValue(ret + i, curr, type);
        if (previousType !== type) {
            typeSize = getNativeTypeSize(type);
            previousType = type
        }
        i += typeSize
    }
    return ret
}

function getMemory(size) {
    if (!runtimeInitialized) return dynamicAlloc(size);
    return _malloc(size)
}
var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;

function UTF8ArrayToString(u8Array, idx, maxBytesToRead) {
    var endIdx = idx + maxBytesToRead;
    var endPtr = idx;
    while (u8Array[endPtr] && !(endPtr >= endIdx)) ++endPtr;
    if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
        return UTF8Decoder.decode(u8Array.subarray(idx, endPtr))
    } else {
        var str = "";
        while (idx < endPtr) {
            var u0 = u8Array[idx++];
            if (!(u0 & 128)) {
                str += String.fromCharCode(u0);
                continue
            }
            var u1 = u8Array[idx++] & 63;
            if ((u0 & 224) == 192) {
                str += String.fromCharCode((u0 & 31) << 6 | u1);
                continue
            }
            var u2 = u8Array[idx++] & 63;
            if ((u0 & 240) == 224) {
                u0 = (u0 & 15) << 12 | u1 << 6 | u2
            } else {
                u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | u8Array[idx++] & 63
            }
            if (u0 < 65536) {
                str += String.fromCharCode(u0)
            } else {
                var ch = u0 - 65536;
                str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023)
            }
        }
    }
    return str
}

function UTF8ToString(ptr, maxBytesToRead) {
    return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : ""
}

function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0)) return 0;
    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1;
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = 65536 + ((u & 1023) << 10) | u1 & 1023
        }
        if (u <= 127) {
            if (outIdx >= endIdx) break;
            outU8Array[outIdx++] = u
        } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break;
            outU8Array[outIdx++] = 192 | u >> 6;
            outU8Array[outIdx++] = 128 | u & 63
        } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break;
            outU8Array[outIdx++] = 224 | u >> 12;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63
        } else {
            if (outIdx + 3 >= endIdx) break;
            outU8Array[outIdx++] = 240 | u >> 18;
            outU8Array[outIdx++] = 128 | u >> 12 & 63;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63
        }
    }
    outU8Array[outIdx] = 0;
    return outIdx - startIdx
}

function stringToUTF8(str, outPtr, maxBytesToWrite) {
    return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite)
}

function lengthBytesUTF8(str) {
    var len = 0;
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
        if (u <= 127) ++len;
        else if (u <= 2047) len += 2;
        else if (u <= 65535) len += 3;
        else len += 4
    }
    return len
}
var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;

function allocateUTF8(str) {
    var size = lengthBytesUTF8(str) + 1;
    var ret = _malloc(size);
    if (ret) stringToUTF8Array(str, HEAP8, ret, size);
    return ret
}

function allocateUTF8OnStack(str) {
    var size = lengthBytesUTF8(str) + 1;
    var ret = stackAlloc(size);
    stringToUTF8Array(str, HEAP8, ret, size);
    return ret
}

function writeArrayToMemory(array, buffer) {
    HEAP8.set(array, buffer)
}

function writeAsciiToMemory(str, buffer, dontAddNull) {
    for (var i = 0; i < str.length; ++i) {
        HEAP8[buffer++ >> 0] = str.charCodeAt(i)
    }
    if (!dontAddNull) HEAP8[buffer >> 0] = 0
}
var PAGE_SIZE = 16384;
var WASM_PAGE_SIZE = 65536;

function alignUp(x, multiple) {
    if (x % multiple > 0) {
        x += multiple - x % multiple
    }
    return x
}
var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

function updateGlobalBufferAndViews(buf) {
    buffer = buf;
    Module["HEAP8"] = HEAP8 = new Int8Array(buf);
    Module["HEAP16"] = HEAP16 = new Int16Array(buf);
    Module["HEAP32"] = HEAP32 = new Int32Array(buf);
    Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
    Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
    Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
    Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
    Module["HEAPF64"] = HEAPF64 = new Float64Array(buf)
}
var DYNAMIC_BASE = 11878256,
    DYNAMICTOP_PTR = 6635184;
var INITIAL_TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 268435456;
if (Module["wasmMemory"]) {
    wasmMemory = Module["wasmMemory"]
} else {
    wasmMemory = new WebAssembly.Memory({
        "initial": INITIAL_TOTAL_MEMORY / WASM_PAGE_SIZE
    })
}
if (wasmMemory) {
    buffer = wasmMemory.buffer
}
INITIAL_TOTAL_MEMORY = buffer.byteLength;
updateGlobalBufferAndViews(buffer);
HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;

function callRuntimeCallbacks(callbacks) {
    while (callbacks.length > 0) {
        var callback = callbacks.shift();
        if (typeof callback == "function") {
            callback();
            continue
        }
        var func = callback.func;
        if (typeof func === "number") {
            if (callback.arg === undefined) {
                Module["dynCall_v"](func)
            } else {
                Module["dynCall_vi"](func, callback.arg)
            }
        } else {
            func(callback.arg === undefined ? null : callback.arg)
        }
    }
}
var __ATPRERUN__ = [];
var __ATINIT__ = [];
var __ATMAIN__ = [];
var __ATEXIT__ = [];
var __ATPOSTRUN__ = [];
var runtimeInitialized = false;
var runtimeExited = false;

function preRun() {
    if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
            addOnPreRun(Module["preRun"].shift())
        }
    }
    callRuntimeCallbacks(__ATPRERUN__)
}

function initRuntime() {
    runtimeInitialized = true;
    if (!Module["noFSInit"] && !FS.init.initialized) FS.init();
    TTY.init();
    callRuntimeCallbacks(__ATINIT__)
}

function preMain() {
    FS.ignorePermissions = false;
    callRuntimeCallbacks(__ATMAIN__)
}

function exitRuntime() {
    runtimeExited = true
}

function postRun() {
    if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
            addOnPostRun(Module["postRun"].shift())
        }
    }
    callRuntimeCallbacks(__ATPOSTRUN__)
}

function addOnPreRun(cb) {
    __ATPRERUN__.unshift(cb)
}

function addOnPostRun(cb) {
    __ATPOSTRUN__.unshift(cb)
}
var Math_abs = Math.abs;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_min = Math.min;
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null;

function getUniqueRunDependency(id) {
    return id
}

function addRunDependency(id) {
    runDependencies++;
    if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies)
    }
}

function removeRunDependency(id) {
    runDependencies--;
    if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies)
    }
    if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
            clearInterval(runDependencyWatcher);
            runDependencyWatcher = null
        }
        if (dependenciesFulfilled) {
            var callback = dependenciesFulfilled;
            dependenciesFulfilled = null;
            callback()
        }
    }
}
Module["preloadedImages"] = {};
Module["preloadedAudios"] = {};

function abort(what) {
    if (Module["onAbort"]) {
        Module["onAbort"](what)
    }
    what += "";
    out(what);
    err(what);
    ABORT = true;
    EXITSTATUS = 1;
    what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
    throw new WebAssembly.RuntimeError(what)
}
var dataURIPrefix = "data:application/octet-stream;base64,";

function isDataURI(filename) {
    return String.prototype.startsWith ? filename.startsWith(dataURIPrefix) : filename.indexOf(dataURIPrefix) === 0
}
var wasmBinaryFile = "glenginewbd47f36c.wasm";
if (!isDataURI(wasmBinaryFile)) {
    wasmBinaryFile = locateFile(wasmBinaryFile)
}

function getBinary() {
    try {
        if (wasmBinary) {
            return new Uint8Array(wasmBinary)
        }
        if (readBinary) {
            return readBinary(wasmBinaryFile)
        } else {
            throw "both async and sync fetching of the wasm failed"
        }
    } catch (err) {
        abort(err)
    }
}

function getBinaryPromise() {
    if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && typeof fetch === "function") {
        return fetch(wasmBinaryFile, {
            credentials: "same-origin"
        }).then(function(response) {
            if (!response["ok"]) {
                throw "failed to load wasm binary file at '" + wasmBinaryFile + "'"
            }
            return response["arrayBuffer"]()
        }).catch(function() {
            return getBinary()
        })
    }
    return new Promise(function(resolve, reject) {
        resolve(getBinary())
    })
}

function createWasm() {
    var info = {
        "env": asmLibraryArg,
        "wasi_unstable": asmLibraryArg,
        "global": {
            "NaN": NaN,
            Infinity: Infinity
        },
        "global.Math": Math,
        "asm2wasm": asm2wasmImports
    };

    function receiveInstance(instance, module) {
        var exports = instance.exports;
        Module["asm"] = exports;
        removeRunDependency("wasm-instantiate")
    }
    addRunDependency("wasm-instantiate");

    function receiveInstantiatedSource(output) {
        receiveInstance(output["instance"])
    }

    function instantiateArrayBuffer(receiver) {
        return getBinaryPromise().then(function(binary) {
            return WebAssembly.instantiate(binary, info)
        }).then(receiver, function(reason) {
            err("failed to asynchronously prepare wasm: " + reason);
            abort(reason)
        })
    }

    function instantiateAsync() {
        if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && typeof fetch === "function") {
            fetch(wasmBinaryFile, {
                credentials: "same-origin"
            }).then(function(response) {
                var result = WebAssembly.instantiateStreaming(response, info);
                return result.then(receiveInstantiatedSource, function(reason) {
                    err("wasm streaming compile failed: " + reason);
                    err("falling back to ArrayBuffer instantiation");
                    instantiateArrayBuffer(receiveInstantiatedSource)
                })
            })
        } else {
            return instantiateArrayBuffer(receiveInstantiatedSource)
        }
    }
    if (Module["instantiateWasm"]) {
        try {
            var exports = Module["instantiateWasm"](info, receiveInstance);
            return exports
        } catch (e) {
            err("Module.instantiateWasm callback failed with error: " + e);
            return false
        }
    }
    instantiateAsync();
    return {}
}
Module["asm"] = createWasm;
var tempDouble;
var tempI64;
var ASM_CONSTS = [

function() {
    if (GLEngineModule.publishApi) GLEngineModule.publishApi()
}, 

function() {
    GLEngineModule.Automator.onFrame()
}, 

function() {
    if (FS.syncFSRequests < 1) {
        FS.syncfs(function(err) {
            if (err) {
                console.error(err)
            }
        })
    }
}, function() {
    GLEngineModule.resetSetTimeout()
}, function() {
    GLEngineModule.removePreloader()
}, function() {
    GLEngineModule.setLoadProgress()
}, function() {
    return document.hidden === undefined || document.hidden ? 1 : 0
}, function($0) {
    var propName = UTF8ToString($0);
    var prop = window[propName];
    if (typeof prop === "string" || prop instanceof String) return lengthBytesUTF8(prop) + 1;
    return 0
}, function($0, $1, $2) {
    var propName = UTF8ToString($0);
    var prop = window[propName];
    stringToUTF8(prop, $1, $2)
}, function() {
    location.reload()
}, function($0) {
    return Module[UTF8ToString($0)]
}, function($0) {
    GLEngineModule.appendLogMessage(UTF8ToString($0))
}, function() {
    return webPSupported
}, function($0, $1, $2, $3, $4, $5) {
    var mask = UTF8ToString($0);
    var masks = mask.split(";");
    var url = UTF8ToString($1);
    dragOverListener = function(event) {
        event.preventDefault()
    };
    dragEnterListener = function(event) {
        dynCall("vi", $2, [1])
    };
    dragLeaveListener = function(event) {
        dynCall("vi", $2, [0])
    };
    dragDropListener = function(event) {
        event.preventDefault();
        var files = event.target.files || event.dataTransfer.files;
        for (var fileNum = 0, file; file = files[fileNum]; fileNum++) {
            if (mask.length > 0) {
                var n = 0;
                for (; n < masks.length; n++)
                    if (file.name.indexOf(masks[n], file.name.lenght - masks[n].length) != -1) break;
                if (n == masks.length) continue
            }
            var len = lengthBytesUTF8(file.name) + 1;
            var str = GLEngineModule._malloc(len);
            stringToUTF8(file.name, str, len);
            var handlerNum = dynCall("ii", $3, [str]);
            if (handlerNum >= 0) {
                var xhr = new XMLHttpRequest;
                (function(handlerNum) {
                    xhr.onload = xhr.onerror = function() {
                        var str = 0;
                        if (this.responseText) {
                            var len = lengthBytesUTF8(this.responseText) + 1;
                            str = GLEngineModule._malloc(len);
                            stringToUTF8(this.responseText, str, len)
                        }
                        dynCall("viii", $4, [handlerNum, this.status, str])
                    };
                    xhr.upload.onprogress = function(event) {
                        dynCall("viii", $5, [handlerNum, event.loaded, event.total])
                    }
                })(handlerNum);
                xhr.open("POST", url, true);
                xhr.withCredentials = true;
                var formData = new FormData;
                formData.append("file", file);
                xhr.send(formData)
            }
        }
        dynCall("vi", $2, [0])
    };
    document.addEventListener("dragover", dragOverListener, false);
    document.addEventListener("dragenter", dragEnterListener, false);
    document.addEventListener("dragleave", dragLeaveListener, false);
    document.addEventListener("drop", dragDropListener, false)
}, function() {
    document.removeEventListener("dragover", dragOverListener, false);
    document.removeEventListener("dragenter", dragEnterListener, false);
    document.removeEventListener("dragleave", dragLeaveListener, false);
    document.removeEventListener("drop", dragDropListener, false)
}, function($0, $1, $2, $3, $4, $5) {
    var mask = UTF8ToString($1);
    var url = UTF8ToString($2);
    var element = document.createElement("div");
    element.innerHTML = '<input type="file" accept="' + mask + '">';
    var fileInput = element.firstChild;
    fileInput.addEventListener("change", function() {
        var len = lengthBytesUTF8(fileInput.files[0].name) + 1;
        var str = GLEngineModule._malloc(len);
        stringToUTF8(fileInput.files[0].name, str, len);
        dynCall("vi", $3, [str]);
        var xhr = new XMLHttpRequest;
        xhr.onload = xhr.onerror = function() {
            var str = 0;
            if (this.responseText) {
                var len = lengthBytesUTF8(this.responseText) + 1;
                var str = GLEngineModule._malloc(len);
                stringToUTF8(this.responseText, str, len)
            }
            dynCall("viii", $5, [$0, this.status, str])
        };
        xhr.upload.onprogress = function(event) {
            dynCall("viii", $4, [$0, event.loaded, event.total])
        };
        xhr.open("POST", url, true);
        xhr.withCredentials = true;
        var formData = new FormData;
        formData.append("file", fileInput.files[0]);
        xhr.send(formData)
    });
    fileInput.click()
}, function($0) {
    if (GLEngineModule.JSWebSockets[$0]) delete GLEngineModule.JSWebSockets[$0]
}, function($0, $1) {
    (function(objptr) {
        var socket;
        if (typeof WebSocket !== "undefined") socket = new WebSocket(UTF8ToString($1));
        else socket = new MozWebSocket(UTF8ToString($1));
        socket.binaryType = "arraybuffer";
        socket.onopen = function() {
            GLEngineModule.WebSocket_onChangeReadyState(objptr, 1, 0)
        };
        socket.onclose = function(event) {
            GLEngineModule.WebSocket_onChangeReadyState(objptr, 3, event.code)
        };
        socket.onmessage = function(event) {
            if (event.data instanceof ArrayBuffer) {
                var dataArray = new Uint8Array(event.data);
                var dataPtr = GLEngineModule._malloc(dataArray.length);
                var dataHeap = new Uint8Array(GLEngineModule.HEAPU8.buffer, dataPtr, dataArray.length);
                dataHeap.set(dataArray);
                GLEngineModule.WebSocket_onReceive(objptr, dataPtr, dataArray.length, 1)
            } else {
                var len = lengthBytesUTF8(event.data) + 1;
                str = GLEngineModule._malloc(len);
                stringToUTF8(event.data, str, len);
                GLEngineModule.WebSocket_onReceive(objptr, str, len - 1, 0)
            }
        };
        socket.onerror = function(error) {};
        GLEngineModule.JSWebSockets[objptr] = socket
    })($0)
}, function($0) {
    try {
        if (GLEngineModule.JSWebSockets[$0] && GLEngineModule.JSWebSockets[$0].readyState == 1) GLEngineModule.JSWebSockets[$0].close()
    } catch (e) {
        console.log("WebSocket close error " + e.name + " : " + e.message)
    }
}, 

function($0, $1) {
    try {
        let d = JSON.parse(UTF8ToString($1));
        if(d.name == 'sendMessage'){
            console.log($0);
            console.log(UTF8ToString($1));
            console.log(d.msg);
        }
        if (GLEngineModule.JSWebSockets[$0] && GLEngineModule.JSWebSockets[$0].readyState == 1) GLEngineModule.JSWebSockets[$0].send(UTF8ToString($1))
    } catch (e) {
        console.log("WebSocket send text error " + e.name + " : " + e.message)
    }
}, 


/*
    let id_ws = JSON.stringify(GLEngineModule.JSWebSockets).split('"')[1];
    GLEngineModule.JSWebSockets[id_ws].send('{"name":"sendMessage","request_id":"239","msg":{"name":"get-user-profile-client","version":"1.0","body":{"user_id":38339102}}}')
    GLEngineModule.JSWebSockets[id_ws].send('{"name":"sendMessage","msg":{"name":"portfolio.get-history-positions","version":"1.0","body":{"user_id":47421726,"user_balance_id":226446523,"instrument_types":["turbo-option","binary-option"],"offset":0,"limit":30}}}')
 */

/*
    USER ID -----> 38339102

    //NOMBRES A OMITIR
    let omite = {
        'timeSync':true,
        'candles':true,
        'candle-generated':true,
        'commission-changed':true,
        'socket-option-closed':true,
        'socket-option-opened':true,
        'balance-changed':true,
        'option':true,
        'option-closed':true,
        'option-opened':true,
        'position-changed':true,
        'option-archived':true,
        'heartbeat':true,
        'traders-mood-changed':true,
        'result':true,
        'underlying-list-changed':true,
        'expiration-top-computed':false,
        'balances':true,
        'instruments-changed':true,
        'spot-buyback-quote-generated':true,
        'set-user-settings-reply':true,
        'signal-created':false
    };

    print = true;
    let parse_data = null;
    let id_ws = JSON.stringify(GLEngineModule.JSWebSockets).split('"')[1];
    GLEngineModule.JSWebSockets[id_ws].onmessage = function(data){
        parse_data = JSON.parse(data.data);
        if(!omite[parse_data.name])
            print && console.log(parse_data);
    }

    GLEngineModule.JSWebSockets[id_ws].send('{"name":"sendMessage","request_id":"240","msg":{"name":"request-leaderboard-userinfo-deals-client","version":"1.0","body":{"requested_user_id":47421726,"country_ids":[0]}}}')
 */

function($0, $1, $2) {
    console.log('20 LLLLLLLLLLLLLL');
    try {
        if (GLEngineModule.JSWebSockets[$0] && GLEngineModule.JSWebSockets[$0].readyState == 1) GLEngineModule.JSWebSockets[$0].send(new Uint8Array(GLEngineModule.HEAPU8.buffer, $1, $2))
    } catch (e) {
        console.log("WebSocket send binary error " + e.name + " : " + e.message)
    }
}, 

function($0) {
    if (GLEngineModule.JSWebSockets[$0]) return GLEngineModule.JSWebSockets[$0].readyState;
    return 3
}, function($0, $1, $2) {
    GLEngineModule.RemoveCookie(UTF8ToString($0), UTF8ToString($1), UTF8ToString($2))
}, function($0, $1, $2, $3, $4) {
    GLEngineModule.UpdateCookie(UTF8ToString($0), UTF8ToString($1), UTF8ToString($2), UTF8ToString($3), UTF8ToString($4))
}, function($0) {
    return document.cookie.length
}, function($0, $1) {
    stringToUTF8(document.cookie, $0, $1)
}, function($0) {
    GLEngineModule.setValue($0, GLEngineModule.Screenshot.loading || GLEngineModule.Screenshot.image == null || GLEngineModule.Screenshot.buffer == null, "i32")
}, function($0, $1, $2, $3) {
    GLEngineModule.setValue($0, GLEngineModule.Screenshot.buffer.length, "i32");
    GLEngineModule.setValue($1, GLEngineModule.Screenshot.image.data.length, "i32");
    GLEngineModule.setValue($2, GLEngineModule.Screenshot.image.width, "i32");
    GLEngineModule.setValue($3, GLEngineModule.Screenshot.image.height, "i32")
}, function($0, $1) {
    GLEngineModule.writeArrayToMemory(GLEngineModule.Screenshot.buffer, $0);
    GLEngineModule.writeArrayToMemory(GLEngineModule.Screenshot.image.data, $1)
}, function($0, $1, $2, $3) {
    GLEngineModule.makeScreenshot($0, $1, $2, $3)
}, function($0) {
    var imgName = UTF8ToString($0);
    if (GLEngineModule.imgs[imgName]) {
        delete GLEngineModule.imgs[imgName]
    }
}, function($0) {
    var imgName = UTF8ToString($0);
    GLEngineModule.imgs[imgName] = GLEngineModule.Screenshot.image;
    GLEngineModule.currentLoadImg = GLEngineModule.Screenshot.image
}, function($0, $1, $2) {
    var name = UTF8ToString($0);
    var w = GLEngineModule.images.getImageWidth(name);
    var h = GLEngineModule.images.getImageHeight(name);
    GLEngineModule.setValue($1, w, "i32");
    GLEngineModule.setValue($2, h, "i32")
}, function($0, $1, $2, $3) {
    var name = UTF8ToString($1);
    GLEngineModule.images.updateBoundTexture($0, name, $2, $3)
}, function($0, $1, $2, $3, $4, $5) {
    GLEngineModule.ImageLoader_Load(UTF8ToString($0), $1, $2, $3, UTF8ToString($4), $5)
}, function($0) {
    return GLEngineModule.images.isLoaded(UTF8ToString($0)) ? 1 : 0
}, function($0) {
    return GLEngineModule.images.getImageWidth(UTF8ToString($0))
}, function($0) {
    return GLEngineModule.images.getImageHeight(UTF8ToString($0))
}, function($0) {
    if (navigator.onLine) {
        GLEngineModule.setValue($0, 1, "i32")
    } else {
        GLEngineModule.setValue($0, 0, "i32")
    }
}, function($0) {
    GLEngineModule.XHRRequests.DestroyXHRRequest($0)
}, function($0, $1, $2, $3) {
    return GLEngineModule.XHRRequests.PeekData($0, $1, $2, $3)
}, function($0) {
    return GLEngineModule.XHRRequests.GetStatusMessageLength($0)
}, function($0, $1, $2) {
    var message = GLEngineModule.XHRRequests.GetStatusMessage($0);
    stringToUTF8(message, $1, $2)
}, function($0) {
    GLEngineModule.XHRRequests.Abort($0)
}, function($0) {
    return GLEngineModule.XHRRequests.GetStatus($0)
}, function($0) {
    return GLEngineModule.XHRRequests.GetResponseSize($0)
}, function($0, $1) {
    GLEngineModule.XHRRequests.CreateXHRRequest($0, $1)
}, function($0, $1, $2) {
    GLEngineModule.XHRRequests.Open($0, $1, UTF8ToString($2))
}, function($0, $1, $2) {
    GLEngineModule.XHRRequests.SetRequestHeader($0, UTF8ToString($1), UTF8ToString($2))
}, function($0) {
    GLEngineModule.XHRRequests.SetRequestHeader($0, "Content-Type", "application/x-www-form-urlencoded")
}, function($0, $1, $2) {
    GLEngineModule.XHRRequests.SetPostData($0, $1, $2)
}, function($0, $1) {
    GLEngineModule.XHRRequests.SetRequestHeader($0, "Content-Type", "multipart/form-data; boundary=" + UTF8ToString($1))
}, function($0) {
    GLEngineModule.XHRRequests.Send($0)
}, function($0, $1, $2, $3) {
    return GLEngineModule.getKerning(UTF8ToString($0), $1, $2, $3)
}, function($0, $1, $2) {
    return GLEngineModule.getCharWidth(UTF8ToString($0), $1, $2)
}, function($0, $1, $2, $3, $4, $5, $6, $7, $8) {
    GLEngineModule.getChar(UTF8ToString($0), $1, $2, $3, $4, $5, $6, $7, $8)
}, function($0, $1, $2, $3, $4, $5) {
    GLEngineModule.getTextMetrics(UTF8ToString($0), $1, $2, $3, $4, $5)
}, function() {
    GLEngineModule.jsResizeWebGlView()
}, function() {
    GLEngineModule.checkPixelRatio()
}, function() {
    console.log("we are almost exit.");
    window.open("", "_self", "");
    window.close()
}, function($0) {
    GLEngineModule.setCanvasCursor(UTF8ToString($0))
}, function($0) {
    return GLEngineModule.isWindowFocused()
}, function($0) {
    return GLEngineModule.isFullscreen()
}, function($0) {
    return GLEngineModule.switchFullscreen($0)
}, function($0, $1, $2, $3) {
    GLEngineModule.showNotification(UTF8ToString($0), UTF8ToString($1), UTF8ToString($2), UTF8ToString($3))
}, function($0) {
    GLEngineModule.setClipboard(UTF8ToString($0))
}, function() {
    window.location.reload(false)
}, function() {
    FS.syncfs(function(error) {
        if (error) {
            console.log("Error while syncing local storage...", error)
        }
    })
}, function($0) {
    return GLEngineModule.isIOS()
}, function() {
    GLEngineModule.stopSound()
}, function($0) {
    return isInStandaloneMode()
}, function($0) {
    FS.mkdir("/local");
    FS.mount(IDBFS, {}, "/local");
    FS.syncfs(true, function(err) {
        if (err) console.error(err);
        else console.log("Local storage synced. ");
        GLEngineModule.AppCoreWeb_CreateLocalStorage($0);
        GLEngineModule.jsFirstPreloadIsCompleted()
    })
}, function() {
    return GLEngineModule.selfHostnameLength()
}, function($0, $1) {
    var ret = GLEngineModule.selfHostname();
    stringToUTF8(ret, $0, $1)
}, function($0) {
    GLEngineModule.setBackgroundColor(UTF8ToString($0))
}, function($0, $1) {
    var iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.id = "webiframe" + $0;
    (function(classPtr) {
        iframe.onload = function() {
            try {
                var url = this.contentWindow.location.href;
                var len = lengthBytesUTF8(url) + 1;
                str = GLEngineModule._malloc(len);
                stringToUTF8(url, str, len);
                dynCall("vii", $1, [classPtr, str])
            } catch (err) {}
        }
    })($0);
    document.body.appendChild(iframe)
}, function($0) {
    var iframe = document.getElementById("webiframe" + $0);
    if (iframe) document.body.removeChild(iframe);
    GLEngineModule.canvas.focus()
}, function($0, $1, $2) {
    var iframe = document.getElementById("webiframe" + $0);
    iframe.src = UTF8ToString($1);
    iframe.style.visibility = "visible";
    iframe.setAttribute("style", UTF8ToString($2))
}, function($0) {
    var iframe = document.getElementById("webiframe" + $0);
    if (iframe) iframe.contentWindow.location.reload(true)
}, function($0) {
    return GLEngineModule.WebCameras.initialize($0, null)
}, function() {
    return GLEngineModule.WebCameras.destroy()
}, function() {
    return GLEngineModule.WebCameras.getWidth()
}, function() {
    return GLEngineModule.WebCameras.getHeight()
}, function($0) {
    return GLEngineModule.WebCameras.renderFrame($0)
}, function($0) {
    var vp = document.createElement("video");
    var mime = UTF8ToString($0);
    var res = vp.canPlayType(mime);
    if (res == "") res = vp.canPlayType("video/" + mime);
    return res != ""
}, function($0) {
    GLEngineModule.MediaPlayers.DestroyMediaPlayer($0)
}, function($0) {
    var player = GLEngineModule.MediaPlayers[$0];
    if (player.video.currentTime) player.video.currentTime = 0;
    player.video.play().catch(function(e) {})
}, function($0) {
    GLEngineModule.MediaPlayers[$0].video.pause()
}, function($0) {
    GLEngineModule.MediaPlayers[$0].video.play()
}, function($0) {
    var player = GLEngineModule.MediaPlayers[$0];
    player.video.pause();
    GLEngineModule.MediaPlayer_StatusChanged($0, GLEngineModule.MediaPlayerStatus.Stopped)
}, function($0, $1) {
    GLEngineModule.MediaPlayers.SeekTo($0, $1)
}, function($0) {
    return GLEngineModule.MediaPlayers[$0].video.currentTime
}, function($0) {
    var dur = GLEngineModule.MediaPlayers[$0].video.duration;
    return isFinite(dur) ? dur : 0
}, function($0, $1) {
    GLEngineModule.MediaPlayers[$0].video.volume = $1
}, function($0) {
    return GLEngineModule.MediaPlayers[$0].video.volume
}, function($0) {
    return GLEngineModule.MediaPlayers[$0].video.videoWidth
}, function($0) {
    return GLEngineModule.MediaPlayers[$0].video.videoHeight
}, function($0) {
    return GLEngineModule.MediaPlayers[$0].texture != null
}, function($0) {
    GLEngineModule.MediaPlayers.RenderFrame($0)
}, function($0) {
    return GLEngineModule.MediaPlayers.hasOwnProperty($0) ? 1 : 0
}, function($0, $1, $2) {
    GLEngineModule.MediaPlayers.CreateMediaPlayer(UTF8ToString($0), $1, $2)
}, function($0) {
    Module["userId"] = $0
}, function() {
    return firebaseCheckPermissions()
}, function($0) {
    firebaseInitialize($0)
}];

function _emscripten_asm_const_i(code) {
    return ASM_CONSTS[code]()
}

function _emscripten_asm_const_iii(code, a0, a1) {
    return ASM_CONSTS[code](a0, a1)
}

function _emscripten_asm_const_ii(code, a0) {
    return ASM_CONSTS[code](a0)
}

function _emscripten_asm_const_iiiiiii(code, a0, a1, a2, a3, a4, a5) {
    return ASM_CONSTS[code](a0, a1, a2, a3, a4, a5)
}

function _emscripten_asm_const_iid(code, a0, a1) {
    return ASM_CONSTS[code](a0, a1)
}

function _emscripten_asm_const_iiii(code, a0, a1, a2) {
    return ASM_CONSTS[code](a0, a1, a2)
}

function _emscripten_asm_const_iiiiii(code, a0, a1, a2, a3, a4) {
    return ASM_CONSTS[code](a0, a1, a2, a3, a4)
}

function _emscripten_asm_const_iiiiiiiidi(code, a0, a1, a2, a3, a4, a5, a6, a7, a8) {
    return ASM_CONSTS[code](a0, a1, a2, a3, a4, a5, a6, a7, a8)
}

function _emscripten_asm_const_iiiii(code, a0, a1, a2, a3) {
    return ASM_CONSTS[code](a0, a1, a2, a3)
}

function _emscripten_asm_const_di(code, a0) {
    return ASM_CONSTS[code](a0)
}

function _emscripten_asm_const_diii(code, a0, a1, a2) {
    return ASM_CONSTS[code](a0, a1, a2)
}

function _emscripten_asm_const_diiii(code, a0, a1, a2, a3) {
    return ASM_CONSTS[code](a0, a1, a2, a3)
}
__ATINIT__.push({
    func: function() {
        __GLOBAL__sub_I_ViewDialogManagerProfile_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewDepositCompact_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewDepositUtils_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewDepositV3_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewFastDeposit_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewDialogMarginalBalance_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewDialogOvernightHistory_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewDialogSelectAccount_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewDialogTournamentReg_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewDialogEditAlert_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewDialogRateManager_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewDepositFormBase_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ManagerChooseTimePopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ManagerExpandingSessionBlock_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewActiveHeaderColumns_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewActiveSelectorItem_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewActiveSelector_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewAmountSelector_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewAssetSchedule_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewBigBuyBackPopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewBinaryDeal_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewChatAttachmentDropdown_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ChartEvents_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_NotificationsEvents_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQAnalyticEvent_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_TooltipEvents_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewAssetProfile_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MarginBalancesListFactory_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CashBalanceListFactory_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_BalancesCashPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_BalancesMarginPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_BalancesBaseItems_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewDepositCardForm_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewChatModeration_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewDepositAmountElement_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewDepositPaymentElement_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewDepositVipElement_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewDepositFormFieldBase_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewDepositFormFieldTextBox_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewDepositBoletoForm_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewDepositDefaultForm_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewCalculator_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewHistoryDealInfo_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewMain_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewSocialProfilePopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewTimeToOpenAsset_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewStrikesPopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewPlotProfit_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewLeaderboardTopAmounts_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewLeaderboardNotification_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewLeftPanelLeaderboard_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewCalendarListItem_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewAssetElement_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewDeletedAccount_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewHistoryDealInfoMarginal_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewEconomicCalendarEventInfo_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewCryptoCalendarEventInfo_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewLeftPanelTab_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewWelcomeToDo_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewOptionRightPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_PopupManager_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewMarginalForexRightPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MFExpBlock_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewMicroBuyBackPopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MarginalUtils_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewCommonPlotElements_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_DealInfoPlot_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewExpBalloon_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewExpiration_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewFormatter_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewFullscreenPopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewGridOfViews_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewIndicatorDialog_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewManager_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewBinaryDealGroup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewOpenPositionNotification_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewPartialCloseDialog_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewPlotNew_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewSelectTime_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewSmallBuyBackPopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewStyles_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_PurchaseConfirmationPopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_QuantitySelectorPopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewLogin_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_PortfolioViewModeContextMenu_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_SpinBoxBase_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_SpinBoxInt_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_SpinBoxDouble_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_TemplatePanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_TimeSelector_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_TimePointModel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_TimeOffsetModel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ComplexTimeSelector_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ScrollingText_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CustomContextMenu_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MultiselectCombobox_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQTimepoint_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_BrandedFeatures_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQBet_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQBilling_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQModelCacheInstruments_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQModelCache_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQModelCacheBase_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQModelCacheBilling_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQModelCacheChat_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_RPProfitBlock_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIOrderBookCryptoColumns_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_DefaultExchangeMode_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ChooseDigitalsType_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIBox_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIBoxBlockElement_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MarginalForexExpirationSelectorFactory_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MultiOptionRightPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_RPAmountBlock_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_RPCallPutBlock_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_RPMultiModeSwitcherBlock_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQModelCacheFeatureToggling_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_RPTimeInputBlock_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_NewsSettingsPopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ActiveGroupSelector_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ColorPicker_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ComboBoxLineWidth_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ComboBoxShapeStyle_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ComboBoxWrap_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IndicatorPlotStyleSelector_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_HorizontalWeekSelector_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQModelQueryBilling_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ServiceHelper_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_TickingPortfolioManager_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_EventInfo_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_BuybackService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ModelBalances_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_BalanceData_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_BalanceCommands_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQActiveCategory_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQModelQuery_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQModelQueryBase_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_DealsHistoryViewModel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQModelQueryDealInfo_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQModelQueryChat_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQModelQueryFeatureToggling_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQModelQueryTrading_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQModelQueryCFD_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQModelQueryOrderBook_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQTimeStats_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ImageUrl_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQAnalytics_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_DealOrder_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQTournament_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQPosition_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQModelCacheTrading_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQPositionContainer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_DealBase_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_DealBinary_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_DealPosition_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_DealsCommands_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_DealsEvents_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MFBuySellBlock_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_DealsGeneral_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_DealsBottomPortfolioViewModel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_OrdersBottomPortfolioViewModel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_PotentialOrder_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_DealsResponseParse_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_DealsService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ModelDeals_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_OrdersPortfolioLeftPanelViewModel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ProxyDealsFilter_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewDialogSettingsAbout_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewNewsItem_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewDialogIndicatorScripted_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CViewDialogSettings_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewDialogSettings_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewDialogSettingsPage_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewDialogSettingsBasic_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewDialogSettingsTrading_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewDialogSettingsHotKeys_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewDialogSettingsNotifications_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewDialogSettingsPrivacy_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewMarketAnalysisItemDashboard_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_SimplifierFeatures_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_OrderBookService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_AuthService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_AuthServiceV2_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ExchangeService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_BillingService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_TournamentsService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_AlertsService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_NewsService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewDealsGroupInfoFactorys_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CVideoEducationPlayer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CCryptoCalendar_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CEarningsCalendar_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CEconomicCalendar_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CMarketAnalysis_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CNewsCalendarBase_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CFilteredEconomicCalendarEvents_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MarginalInstrumentController_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_BuySellHighlight_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CMarginalForexRightPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_TradersMoodService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_DealInfoItemWrapBase_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_DealInfoItemWrapBinary_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_DealInfoItemWrapMarginalStock_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_DealInfoItemWrapStock_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_DealInfoItemWrapStrike_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewTradingHistoryFactorys_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewTradingHistory_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewVideoEducation_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewMarketAnalysisItemAssetProfile_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQBasePositionInstrument_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CalculationPositionInstrumentFX_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MultiTradeService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_PositionInstrumentMulti_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_TranslationsService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CalendarService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_PopupNotificationService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_AssetsService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_GDPRService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ProTraderService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_PnlService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_PositionInstrumentFX_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_PriceMovementsService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_TechInstrumentsService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ScriptedIndicatorsService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_PipsService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_BalancesService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ExchangeRatesService_cpp()
    }
}, {
    func: function() {
        ___emscripten_environ_constructor()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_bind_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_iostream_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_PositionInstrumentCFD_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_VideoEducationService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_KYCService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_DeepLinkService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_AssetQuotesProvider_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UserSettingsService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_RandomQuotesProvider_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_InstrumentsSubscriptionManager_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CFDTradeService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_TPSLInstrument_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CVideoEducation_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CalculationBaseInstrument_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CalculationPositionInstrument_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_DigitalTradeService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_PositionInstrumentDigital_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CalculationPositionInstrumentDigital_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_BinaryTradeService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_PositionInstrumentBinary_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CalculationPositionInstrumentBinary_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_FXTradeService_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewTemplatesPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewFactoryOrdersLeftPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewFactoryFullscreenPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_PortfolioItemBind_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewPortfolioDealInfo_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewPriceMovement_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewPriceMovementNotification_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MobileViews_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MobileViewDownloadApp_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MobileViewHomescreen_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewAssetInfo_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewFactoryPortfolioLeftPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewScriptedIndicatorsPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_PlotAlertPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CStrikes_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CStrikeTrading_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CStrikeExpiration_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CStrikeTimescale_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CStrikeRightPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CStrikeDealIndication_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CDigitalTrading_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewStrikePlotElements_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MFTpSlBlock_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewDialogPopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewExchangeRightPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewProfitLossPopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewTpslCombobox_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewCommonConfirmPopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewPurchaseConfirmPopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewPopupCommissionBlock_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewPopupNotification_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewStrikeHidden_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CDigitalDealIndication_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewStrikes_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewDigitalSelectTime_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewDigitalSelectStrikes_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewDigitalDeal_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewDigitalDealGroup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewDigitalBigBuyBackPopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewPortfolioLeftPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewPortfolioBottomPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewPortfolioFullscreenPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewCommissionsFeeInfo_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewMarginalForexDealItem_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewMarginalForexExpiration_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewMarginalForexOrderItem_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewMarginalForexPlotDeals_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewExchangeInfoPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewBigOrdersPopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIBtnProgressBar_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIProgressBar_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewPlotBubble_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewPlotOrder_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewAutomarginPopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewOvernightScheduleInfo_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIBtnWithConfirm_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UICircleMultiProgressBar_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UICircleProgressBar_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UICurrencyAmount_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIPlaceholderImage_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIToggleBtns_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UISmallConfirmationButton_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CTradingHistory_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewBalanceElement_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CDigitalPlotProfit_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CFXTrading_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CFXPlotProfit_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CFXDealIndication_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CFXProfitIndicator_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CCFDSmallClosePosition_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CPendingConfirmPopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CExchangeRightPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CPlotMode_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIOrderBookCryptoAnimations_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewCFDInfoPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewCFDRightPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewCFDPlotIndication_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewProfitIndicator_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewBigClosePositionPopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewCFDPlotElements_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewSmallClosePosition_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewPendingConfirmPopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewStockPlotMargin_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_VideoCaptureWeb_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewBase_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewFactoryDefault_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewFactoryTemplate_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewItemsList_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewFrame_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewComboBox_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ViewItemsTree_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_XHRResponse_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_main_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_AppCoreWeb_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ModelValue_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIVideoPlayer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_WebMediaPlayer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_GifMediaPlayer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQPlot_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MiniPlot_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MiniInstrumentDataQuotes_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_PlotShadow_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CandleDrawInfo_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQDrawingsManager_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_HtmlStyleEdge_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_HtmlFontSettings_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_HtmlTagBase_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_HtmlRenderer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_HtmlParser_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_HtmlUtils_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_HtmlLineSettings_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_HtmlTextAlign_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_HtmlLayout_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_HtmlTagStyleClass_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_HtmlStyleRect_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_NativeIndicatorAdapterBase_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_HtmlVerticalAlign_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_HtmlTagMedia_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_HtmlCursor_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_HtmlPrint_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_HtmlEvent_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_HtmlCssIQStyle_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_HtmlWordSettings_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_HtmlListSettings_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ModelItemsList_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChatBottomTradingVolume_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQModelCommand_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_LeaderboardItem_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_TopDealsCombobox_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_TopDealsElementFactory_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_TopDealsModel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_TopDealsTab_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChatAttachmentElement_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChatAttachmentPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChatBottomDeposit_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChatBottomEnterText_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQCommandUser_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChatMessageElement_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChatMessageSuggestionElement_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChatRateSupportElement_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChatRoomInfoElement_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChatMessagePanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChatRoomPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChat_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChatAttachmentDropdown_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChatBottomPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_InstrumentDataWilliamsRangeRenderer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_InstrumentDataAORenderer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_InstrumentDataCCIRenderer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_InstrumentDataMACDRenderer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_InstrumentDataBelkhayateRenderer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_InstrumentPriceMovementRenderer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_InstrumentDataDPORenderer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_InstrumentDataRSIRenderer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_InstrumentDataStochasticRenderer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_InstrumentDataKDJRenderer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_InstrumentDataMomentumRenderer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_HtmlCssValues_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_InstrumentTypes_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CandleValueGetter_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ScriptedInstrument_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_InstrumentDataScriptedRenderer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQCommand_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQBusCommand_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQCommandBilling_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQCommandTradeRoom_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQCommandTrading_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIElement_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_DragAndDrop_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_NativeSystemDialogs_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_SDFData_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_StackPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_TrafficSniffer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_TreeQuery_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UI_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIButton_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIScale_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIControl_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_DockPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIHsvPicker_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIDraggable_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIScrollView_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIScrollBarNew_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UISectionList_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UISlider_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIGrid_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UILine_cpp()
    }
}, {
    func: function() {
        ___cxx_global_var_init_6_3040()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_VirtualKeyboardDigitsPad_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_Automation_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_AutomationValue_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_crc32_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MVBigDecimal_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MVLocalization_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MVLog_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MVStringUtils_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MVTimeUtils_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_Timer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_VirtualKeyboard_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UITextBox_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_VirtualKeyboardDefines_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_VirtualKeyboardDefaultPad_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UString_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_Debug_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_AppCoreCommon_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_AnimationGroup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CSSTransition_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MVFont_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MVRenderer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UITimer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UICheckBox_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIFrame_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIHint_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIPreloader_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIRadioBox_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIRadioButton_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIScrollBar_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UISelectorPicker_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UITabControl_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UITabPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_PluralForms_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIWebImage_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIToggleableButton_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_Color_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ImageLoader_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_Canvas_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_Pen_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_QrCode_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_HtmlCssTagStylesDefault_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_HtmlCssTagStylesHover_cpp()
    }
}, {
    func: function() {
        ___cxx_global_var_init_3_3583()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIVirtualKeyboard_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIHtmlView_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIAnimatedSprite_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UICollapsibleLabel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIElidedLabel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIWebView_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIQRCodeElement_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIGridColorPicker_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_WebSocket_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChatCache_cpp()
    }
}, {
    func: function() {
        ___cxx_global_var_init_4_3584()
    }
}, {
    func: function() {
        ___cxx_global_var_init_5_3585()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_Base_cpp()
    }
}, {
    func: function() {
        ___cxx_global_var_init_16_3605()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ComboBox_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ListBox_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIWebCamera_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_WebScreenshot_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MoneyFormatters_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CCFDPlotProfit_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_DealsContainer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CUser_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CImageListPreview_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CLeaderboard_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CPlotProfit_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CSocialProfile_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CProfitLossPopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CPopupNotification_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CCFDRightPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CStockTrading_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CLiveDeals_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CStockProfitIndicator_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CExchangeInfoPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CExchangePositionIndication_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CExchangeTrading_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ConfirmPopupExchangeState_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CCFDPositionIndication_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CStockPlotMargin_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CAutomarginDialog_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CStockExpiration_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CPlotNativeIndicators_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MarginalForexTrading_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MarginalForexExpirationSelector_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MarginalForexPlotOrders_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MarginalPlotTPSL_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MarginalForexPlotDirectionDeals_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MarginalForexTPSLSelector_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MarginalForexPendingEditor_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CBaseTrading_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CBinaryTrading_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CPlotDrawingsNew_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CCommonConfirmPopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CPlotNew_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CPartialCloseDialog_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CPlotNewSmartSeparator_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CBinaryRightPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CPlotTimescale_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CTradersChoice_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CPlotToolsPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CPlotTab_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CTournaments_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_APTechnicalAnalysis_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_APEarningsCalendar_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_APForexCalendar_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_APScheduleInfo_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_APOvernightInfo_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_APTableControl_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_APTradeInfoExpirations_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_APTradeInfoBinaryProfit_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_APTradeInfo_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_APInfoBlock_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_APLiveStatistic_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_PriceInfoBlock_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_APNews_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIMeter_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_TradersMoodInfoBlock_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_TradersMoodLine_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_TradersMoodRomb_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_NearestExpirationsList_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIOrderBook_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIOrderBookCrypto_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_UIOrderBookHistory_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CWidgets_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CPurchaseConfirmPopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_LeftMenuSettings_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_LeftPanelSmart_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CAssetElement_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CWelcomeToDo_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_COrderBook_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_COrderBookSetups_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_COrderBookHistory_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CIndicators_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQAppConfig_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CScriptedIndicators_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CHiLo_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CNews_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CWebViewer_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CInstrument_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CIndicatorsWelcomePopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CAssetInfo_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CClientCategoryDialog_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CGDPR_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CAppUpdate_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ActiveSelectorSortController_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ActiveSelectorLeftPart_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ActivesController_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ActiveSelectorLeftPartPrivate_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CAssetRender_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ActivesPositionsCounter_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_MultiOptionRender_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CAssetRenderPrivate_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CActiveSelector_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CAmountSelector_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ActiveSelectorSearchFactories_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_BalanceHeaderMargin_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_BalanceHeaderCash_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_BalanceHeader_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CBalances_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CBalanceElement_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CBinaryDealIndication_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CBuyBackPopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CColorPickerPopup_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CContactSupportStatusBar_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CRateManager_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChatEmojiPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChatLeftPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChatMessageList_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChatModeration_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChatRules_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChatSendMessageError_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChatSettings_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChatStatusPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CChatUtils_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CPriceMovementNotification_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CDealInfo_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CVipManagerSelectScreen_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CVipManagerProfile_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ManagerWorkTime_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_NewsBubble_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_NewsOnPlotHelper_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_NewsOnPlot_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ApplicationIQ_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ActiveSelectorSearch_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_ActiveSelectorSearchModel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CGridOfViewsScenario_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewGridItemHolder_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_IQViewGridTab_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_AlertsListViewFactories_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_AlertsLPActiveModel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_AlertsLPHistoryModel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_AlertsLPModelBase_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CAlerts_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CEditAlert_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CPlotAlerts_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_AlertsLeftPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_GridTabsController_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CGridOfViews_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CLeftPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CMain_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CMinimumInvestmentController_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CMainIndicators_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CPositionClosed_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CPositionOpened_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CMonitoring_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CNotifications_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CDepositV4_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CAssetProfile_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CDashboard_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CDashboardItemConstructor_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CProfitLine_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CDeposit_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CDepositCompact_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CDepositController_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CDepositRegulatorIcons_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CDepositV3_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_brand_defs_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CDepositKYCPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CDepositPaymentFormPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CDepositPaymentSelectPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CDepositTournamentRebuyPanel_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CEmailActivation_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CDealsCommissionHistory_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CBuyBack_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CExpBalloon_cpp()
    }
}, {
    func: function() {
        __GLOBAL__sub_I_CBinaryExpiration_cpp()
    }
});

function demangle(func) {
    return func
}

function demangleAll(text) {
    var regex = /\b__Z[\w\d_]+/g;
    return text.replace(regex, function(x) {
        var y = demangle(x);
        return x === y ? x : y + " [" + x + "]"
    })
}

function jsStackTrace() {
    var err = new Error;
    if (!err.stack) {
        try {
            throw new Error(0)
        } catch (e) {
            err = e
        }
        if (!err.stack) {
            return "(no stack trace available)"
        }
    }
    return err.stack.toString()
}

function stackTrace() {
    var js = jsStackTrace();
    if (Module["extraStackTrace"]) js += "\n" + Module["extraStackTrace"]();
    return demangleAll(js)
}

function ___assert_fail(condition, filename, line, func) {
    abort("Assertion failed: " + UTF8ToString(condition) + ", at: " + [filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function"])
}
var ENV = {};

function ___buildEnvironment(environ) {
    var MAX_ENV_VALUES = 64;
    var TOTAL_ENV_SIZE = 1024;
    var poolPtr;
    var envPtr;
    if (!___buildEnvironment.called) {
        ___buildEnvironment.called = true;
        ENV["USER"] = "web_user";
        ENV["LOGNAME"] = "web_user";
        ENV["PATH"] = "/";
        ENV["PWD"] = "/";
        ENV["HOME"] = "/home/web_user";
        ENV["LANG"] = (typeof navigator === "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
        ENV["_"] = thisProgram;
        poolPtr = getMemory(TOTAL_ENV_SIZE);
        envPtr = getMemory(MAX_ENV_VALUES * 4);
        HEAP32[envPtr >> 2] = poolPtr;
        HEAP32[environ >> 2] = envPtr
    } else {
        envPtr = HEAP32[environ >> 2];
        poolPtr = HEAP32[envPtr >> 2]
    }
    var strings = [];
    var totalSize = 0;
    for (var key in ENV) {
        if (typeof ENV[key] === "string") {
            var line = key + "=" + ENV[key];
            strings.push(line);
            totalSize += line.length
        }
    }
    if (totalSize > TOTAL_ENV_SIZE) {
        throw new Error("Environment size exceeded TOTAL_ENV_SIZE!")
    }
    var ptrSize = 4;
    for (var i = 0; i < strings.length; i++) {
        var line = strings[i];
        writeAsciiToMemory(line, poolPtr);
        HEAP32[envPtr + i * ptrSize >> 2] = poolPtr;
        poolPtr += line.length + 1
    }
    HEAP32[envPtr + strings.length * ptrSize >> 2] = 0
}

function _emscripten_get_now() {
    abort()
}

function _emscripten_get_now_is_monotonic() {
    return 0 || ENVIRONMENT_IS_NODE || typeof dateNow !== "undefined" || typeof performance === "object" && performance && typeof performance["now"] === "function"
}

function ___setErrNo(value) {
    if (Module["___errno_location"]) HEAP32[Module["___errno_location"]() >> 2] = value;
    return value
}

function _clock_gettime(clk_id, tp) {
    var now;
    if (clk_id === 0) {
        now = Date.now()
    } else if (clk_id === 1 && _emscripten_get_now_is_monotonic()) {
        now = _emscripten_get_now()
    } else {
        ___setErrNo(28);
        return -1
    }
    HEAP32[tp >> 2] = now / 1e3 | 0;
    HEAP32[tp + 4 >> 2] = now % 1e3 * 1e3 * 1e3 | 0;
    return 0
}

function ___clock_gettime(a0, a1) {
    return _clock_gettime(a0, a1)
}

function ___cxa_allocate_exception(size) {
    return _malloc(size)
}
var ___exception_infos = {};
var ___exception_caught = [];

function ___exception_deAdjust(adjusted) {
    if (!adjusted || ___exception_infos[adjusted]) return adjusted;
    for (var key in ___exception_infos) {
        var ptr = +key;
        var adj = ___exception_infos[ptr].adjusted;
        var len = adj.length;
        for (var i = 0; i < len; i++) {
            if (adj[i] === adjusted) {
                return ptr
            }
        }
    }
    return adjusted
}
var ___exception_last = 0;

function ___cxa_rethrow() {
    var ptr = ___exception_caught.pop();
    ptr = ___exception_deAdjust(ptr);
    if (!___exception_infos[ptr].rethrown) {
        ___exception_caught.push(ptr);
        ___exception_infos[ptr].rethrown = true
    }
    ___exception_last = ptr;
    throw ptr
}

function ___cxa_throw(ptr, type, destructor) {
    ___exception_infos[ptr] = {
        ptr: ptr,
        adjusted: [ptr],
        type: type,
        destructor: destructor,
        refcount: 0,
        caught: false,
        rethrown: false
    };
    ___exception_last = ptr;
    if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
        __ZSt18uncaught_exceptionv.uncaught_exceptions = 1
    } else {
        __ZSt18uncaught_exceptionv.uncaught_exceptions++
    }
    throw ptr
}

function ___lock() {}

function ___map_file(pathname, size) {
    ___setErrNo(63);
    return -1
}
var PATH = {
    splitPath: function(filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1)
    },
    normalizeArray: function(parts, allowAboveRoot) {
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
            var last = parts[i];
            if (last === ".") {
                parts.splice(i, 1)
            } else if (last === "..") {
                parts.splice(i, 1);
                up++
            } else if (up) {
                parts.splice(i, 1);
                up--
            }
        }
        if (allowAboveRoot) {
            for (; up; up--) {
                parts.unshift("..")
            }
        }
        return parts
    },
    normalize: function(path) {
        var isAbsolute = path.charAt(0) === "/",
            trailingSlash = path.substr(-1) === "/";
        path = PATH.normalizeArray(path.split("/").filter(function(p) {
            return !!p
        }), !isAbsolute).join("/");
        if (!path && !isAbsolute) {
            path = "."
        }
        if (path && trailingSlash) {
            path += "/"
        }
        return (isAbsolute ? "/" : "") + path
    },
    dirname: function(path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
            return "."
        }
        if (dir) {
            dir = dir.substr(0, dir.length - 1)
        }
        return root + dir
    },
    basename: function(path) {
        if (path === "/") return "/";
        var lastSlash = path.lastIndexOf("/");
        if (lastSlash === -1) return path;
        return path.substr(lastSlash + 1)
    },
    extname: function(path) {
        return PATH.splitPath(path)[3]
    },
    join: function() {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join("/"))
    },
    join2: function(l, r) {
        return PATH.normalize(l + "/" + r)
    }
};
var PATH_FS = {
    resolve: function() {
        var resolvedPath = "",
            resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
            var path = i >= 0 ? arguments[i] : FS.cwd();
            if (typeof path !== "string") {
                throw new TypeError("Arguments to path.resolve must be strings")
            } else if (!path) {
                return ""
            }
            resolvedPath = path + "/" + resolvedPath;
            resolvedAbsolute = path.charAt(0) === "/"
        }
        resolvedPath = PATH.normalizeArray(resolvedPath.split("/").filter(function(p) {
            return !!p
        }), !resolvedAbsolute).join("/");
        return (resolvedAbsolute ? "/" : "") + resolvedPath || "."
    },
    relative: function(from, to) {
        from = PATH_FS.resolve(from).substr(1);
        to = PATH_FS.resolve(to).substr(1);

        function trim(arr) {
            var start = 0;
            for (; start < arr.length; start++) {
                if (arr[start] !== "") break
            }
            var end = arr.length - 1;
            for (; end >= 0; end--) {
                if (arr[end] !== "") break
            }
            if (start > end) return [];
            return arr.slice(start, end - start + 1)
        }
        var fromParts = trim(from.split("/"));
        var toParts = trim(to.split("/"));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
            if (fromParts[i] !== toParts[i]) {
                samePartsLength = i;
                break
            }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
            outputParts.push("..")
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join("/")
    }
};
var TTY = {
    ttys: [],
    init: function() {},
    shutdown: function() {},
    register: function(dev, ops) {
        TTY.ttys[dev] = {
            input: [],
            output: [],
            ops: ops
        };
        FS.registerDevice(dev, TTY.stream_ops)
    },
    stream_ops: {
        open: function(stream) {
            var tty = TTY.ttys[stream.node.rdev];
            if (!tty) {
                throw new FS.ErrnoError(43)
            }
            stream.tty = tty;
            stream.seekable = false
        },
        close: function(stream) {
            stream.tty.ops.flush(stream.tty)
        },
        flush: function(stream) {
            stream.tty.ops.flush(stream.tty)
        },
        read: function(stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.get_char) {
                throw new FS.ErrnoError(60)
            }
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
                var result;
                try {
                    result = stream.tty.ops.get_char(stream.tty)
                } catch (e) {
                    throw new FS.ErrnoError(29)
                }
                if (result === undefined && bytesRead === 0) {
                    throw new FS.ErrnoError(6)
                }
                if (result === null || result === undefined) break;
                bytesRead++;
                buffer[offset + i] = result
            }
            if (bytesRead) {
                stream.node.timestamp = Date.now()
            }
            return bytesRead
        },
        write: function(stream, buffer, offset, length, pos) {
            if (!stream.tty || !stream.tty.ops.put_char) {
                throw new FS.ErrnoError(60)
            }
            try {
                for (var i = 0; i < length; i++) {
                    stream.tty.ops.put_char(stream.tty, buffer[offset + i])
                }
            } catch (e) {
                throw new FS.ErrnoError(29)
            }
            if (length) {
                stream.node.timestamp = Date.now()
            }
            return i
        }
    },
    default_tty_ops: {
        get_char: function(tty) {
            if (!tty.input.length) {
                var result = null;
                if (ENVIRONMENT_IS_NODE) {
                    var BUFSIZE = 256;
                    var buf = Buffer.alloc ? Buffer.alloc(BUFSIZE) : new Buffer(BUFSIZE);
                    var bytesRead = 0;
                    try {
                        bytesRead = nodeFS.readSync(process.stdin.fd, buf, 0, BUFSIZE, null)
                    } catch (e) {
                        if (e.toString().indexOf("EOF") != -1) bytesRead = 0;
                        else throw e
                    }
                    if (bytesRead > 0) {
                        result = buf.slice(0, bytesRead).toString("utf-8")
                    } else {
                        result = null
                    }
                } else if (typeof window != "undefined" && typeof window.prompt == "function") {
                    result = window.prompt("Input: ");
                    if (result !== null) {
                        result += "\n"
                    }
                } else if (typeof readline == "function") {
                    result = readline();
                    if (result !== null) {
                        result += "\n"
                    }
                }
                if (!result) {
                    return null
                }
                tty.input = intArrayFromString(result, true)
            }
            return tty.input.shift()
        },
        put_char: function(tty, val) {
            if (val === null || val === 10) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            } else {
                if (val != 0) tty.output.push(val)
            }
        },
        flush: function(tty) {
            if (tty.output && tty.output.length > 0) {
                out(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            }
        }
    },
    default_tty1_ops: {
        put_char: function(tty, val) {
            if (val === null || val === 10) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            } else {
                if (val != 0) tty.output.push(val)
            }
        },
        flush: function(tty) {
            if (tty.output && tty.output.length > 0) {
                err(UTF8ArrayToString(tty.output, 0));
                tty.output = []
            }
        }
    }
};
var MEMFS = {
    ops_table: null,
    mount: function(mount) {
        return MEMFS.createNode(null, "/", 16384 | 511, 0)
    },
    createNode: function(parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
            throw new FS.ErrnoError(63)
        }
        if (!MEMFS.ops_table) {
            MEMFS.ops_table = {
                dir: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr,
                        lookup: MEMFS.node_ops.lookup,
                        mknod: MEMFS.node_ops.mknod,
                        rename: MEMFS.node_ops.rename,
                        unlink: MEMFS.node_ops.unlink,
                        rmdir: MEMFS.node_ops.rmdir,
                        readdir: MEMFS.node_ops.readdir,
                        symlink: MEMFS.node_ops.symlink
                    },
                    stream: {
                        llseek: MEMFS.stream_ops.llseek
                    }
                },
                file: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr
                    },
                    stream: {
                        llseek: MEMFS.stream_ops.llseek,
                        read: MEMFS.stream_ops.read,
                        write: MEMFS.stream_ops.write,
                        allocate: MEMFS.stream_ops.allocate,
                        mmap: MEMFS.stream_ops.mmap,
                        msync: MEMFS.stream_ops.msync
                    }
                },
                link: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr,
                        readlink: MEMFS.node_ops.readlink
                    },
                    stream: {}
                },
                chrdev: {
                    node: {
                        getattr: MEMFS.node_ops.getattr,
                        setattr: MEMFS.node_ops.setattr
                    },
                    stream: FS.chrdev_stream_ops
                }
            }
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
            node.node_ops = MEMFS.ops_table.dir.node;
            node.stream_ops = MEMFS.ops_table.dir.stream;
            node.contents = {}
        } else if (FS.isFile(node.mode)) {
            node.node_ops = MEMFS.ops_table.file.node;
            node.stream_ops = MEMFS.ops_table.file.stream;
            node.usedBytes = 0;
            node.contents = null
        } else if (FS.isLink(node.mode)) {
            node.node_ops = MEMFS.ops_table.link.node;
            node.stream_ops = MEMFS.ops_table.link.stream
        } else if (FS.isChrdev(node.mode)) {
            node.node_ops = MEMFS.ops_table.chrdev.node;
            node.stream_ops = MEMFS.ops_table.chrdev.stream
        }
        node.timestamp = Date.now();
        if (parent) {
            parent.contents[name] = node
        }
        return node
    },
    getFileDataAsRegularArray: function(node) {
        if (node.contents && node.contents.subarray) {
            var arr = [];
            for (var i = 0; i < node.usedBytes; ++i) arr.push(node.contents[i]);
            return arr
        }
        return node.contents
    },
    getFileDataAsTypedArray: function(node) {
        if (!node.contents) return new Uint8Array;
        if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes);
        return new Uint8Array(node.contents)
    },
    expandFileStorage: function(node, newCapacity) {
        var prevCapacity = node.contents ? node.contents.length : 0;
        if (prevCapacity >= newCapacity) return;
        var CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(newCapacity, prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2 : 1.125) | 0);
        if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256);
        var oldContents = node.contents;
        node.contents = new Uint8Array(newCapacity);
        if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0);
        return
    },
    resizeFileStorage: function(node, newSize) {
        if (node.usedBytes == newSize) return;
        if (newSize == 0) {
            node.contents = null;
            node.usedBytes = 0;
            return
        }
        if (!node.contents || node.contents.subarray) {
            var oldContents = node.contents;
            node.contents = new Uint8Array(new ArrayBuffer(newSize));
            if (oldContents) {
                node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes)))
            }
            node.usedBytes = newSize;
            return
        }
        if (!node.contents) node.contents = [];
        if (node.contents.length > newSize) node.contents.length = newSize;
        else
            while (node.contents.length < newSize) node.contents.push(0);
        node.usedBytes = newSize
    },
    node_ops: {
        getattr: function(node) {
            var attr = {};
            attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
            attr.ino = node.id;
            attr.mode = node.mode;
            attr.nlink = 1;
            attr.uid = 0;
            attr.gid = 0;
            attr.rdev = node.rdev;
            if (FS.isDir(node.mode)) {
                attr.size = 4096
            } else if (FS.isFile(node.mode)) {
                attr.size = node.usedBytes
            } else if (FS.isLink(node.mode)) {
                attr.size = node.link.length
            } else {
                attr.size = 0
            }
            attr.atime = new Date(node.timestamp);
            attr.mtime = new Date(node.timestamp);
            attr.ctime = new Date(node.timestamp);
            attr.blksize = 4096;
            attr.blocks = Math.ceil(attr.size / attr.blksize);
            return attr
        },
        setattr: function(node, attr) {
            if (attr.mode !== undefined) {
                node.mode = attr.mode
            }
            if (attr.timestamp !== undefined) {
                node.timestamp = attr.timestamp
            }
            if (attr.size !== undefined) {
                MEMFS.resizeFileStorage(node, attr.size)
            }
        },
        lookup: function(parent, name) {
            throw FS.genericErrors[44]
        },
        mknod: function(parent, name, mode, dev) {
            return MEMFS.createNode(parent, name, mode, dev)
        },
        rename: function(old_node, new_dir, new_name) {
            if (FS.isDir(old_node.mode)) {
                var new_node;
                try {
                    new_node = FS.lookupNode(new_dir, new_name)
                } catch (e) {}
                if (new_node) {
                    for (var i in new_node.contents) {
                        throw new FS.ErrnoError(55)
                    }
                }
            }
            delete old_node.parent.contents[old_node.name];
            old_node.name = new_name;
            new_dir.contents[new_name] = old_node;
            old_node.parent = new_dir
        },
        unlink: function(parent, name) {
            delete parent.contents[name]
        },
        rmdir: function(parent, name) {
            var node = FS.lookupNode(parent, name);
            for (var i in node.contents) {
                throw new FS.ErrnoError(55)
            }
            delete parent.contents[name]
        },
        readdir: function(node) {
            var entries = [".", ".."];
            for (var key in node.contents) {
                if (!node.contents.hasOwnProperty(key)) {
                    continue
                }
                entries.push(key)
            }
            return entries
        },
        symlink: function(parent, newname, oldpath) {
            var node = MEMFS.createNode(parent, newname, 511 | 40960, 0);
            node.link = oldpath;
            return node
        },
        readlink: function(node) {
            if (!FS.isLink(node.mode)) {
                throw new FS.ErrnoError(28)
            }
            return node.link
        }
    },
    stream_ops: {
        read: function(stream, buffer, offset, length, position) {
            var contents = stream.node.contents;
            if (position >= stream.node.usedBytes) return 0;
            var size = Math.min(stream.node.usedBytes - position, length);
            if (size > 8 && contents.subarray) {
                buffer.set(contents.subarray(position, position + size), offset)
            } else {
                for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i]
            }
            return size
        },
        write: function(stream, buffer, offset, length, position, canOwn) {
            canOwn = false;
            if (!length) return 0;
            var node = stream.node;
            node.timestamp = Date.now();
            if (buffer.subarray && (!node.contents || node.contents.subarray)) {
                if (canOwn) {
                    node.contents = buffer.subarray(offset, offset + length);
                    node.usedBytes = length;
                    return length
                } else if (node.usedBytes === 0 && position === 0) {
                    node.contents = new Uint8Array(buffer.subarray(offset, offset + length));
                    node.usedBytes = length;
                    return length
                } else if (position + length <= node.usedBytes) {
                    node.contents.set(buffer.subarray(offset, offset + length), position);
                    return length
                }
            }
            MEMFS.expandFileStorage(node, position + length);
            if (node.contents.subarray && buffer.subarray) node.contents.set(buffer.subarray(offset, offset + length), position);
            else {
                for (var i = 0; i < length; i++) {
                    node.contents[position + i] = buffer[offset + i]
                }
            }
            node.usedBytes = Math.max(node.usedBytes, position + length);
            return length
        },
        llseek: function(stream, offset, whence) {
            var position = offset;
            if (whence === 1) {
                position += stream.position
            } else if (whence === 2) {
                if (FS.isFile(stream.node.mode)) {
                    position += stream.node.usedBytes
                }
            }
            if (position < 0) {
                throw new FS.ErrnoError(28)
            }
            return position
        },
        allocate: function(stream, offset, length) {
            MEMFS.expandFileStorage(stream.node, offset + length);
            stream.node.usedBytes = Math.max(stream.node.usedBytes, offset + length)
        },
        mmap: function(stream, buffer, offset, length, position, prot, flags) {
            if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(43)
            }
            var ptr;
            var allocated;
            var contents = stream.node.contents;
            if (!(flags & 2) && (contents.buffer === buffer || contents.buffer === buffer.buffer)) {
                allocated = false;
                ptr = contents.byteOffset
            } else {
                if (position > 0 || position + length < stream.node.usedBytes) {
                    if (contents.subarray) {
                        contents = contents.subarray(position, position + length)
                    } else {
                        contents = Array.prototype.slice.call(contents, position, position + length)
                    }
                }
                allocated = true;
                var fromHeap = buffer.buffer == HEAP8.buffer;
                ptr = _malloc(length);
                if (!ptr) {
                    throw new FS.ErrnoError(48)
                }(fromHeap ? HEAP8 : buffer).set(contents, ptr)
            }
            return {
                ptr: ptr,
                allocated: allocated
            }
        },
        msync: function(stream, buffer, offset, length, mmapFlags) {
            if (!FS.isFile(stream.node.mode)) {
                throw new FS.ErrnoError(43)
            }
            if (mmapFlags & 2) {
                return 0
            }
            var bytesWritten = MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
            return 0
        }
    }
};
var IDBFS = {
    dbs: {},
    indexedDB: function() {
        if (typeof indexedDB !== "undefined") return indexedDB;
        var ret = null;
        if (typeof window === "object") ret = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        assert(ret, "IDBFS used, but indexedDB not supported");
        return ret
    },
    DB_VERSION: 21,
    DB_STORE_NAME: "FILE_DATA",
    mount: function(mount) {
        return MEMFS.mount.apply(null, arguments)
    },
    syncfs: function(mount, populate, callback) {
        IDBFS.getLocalSet(mount, function(err, local) {
            if (err) return callback(err);
            IDBFS.getRemoteSet(mount, function(err, remote) {
                if (err) return callback(err);
                var src = populate ? remote : local;
                var dst = populate ? local : remote;
                IDBFS.reconcile(src, dst, callback)
            })
        })
    },
    getDB: function(name, callback) {
        var db = IDBFS.dbs[name];
        if (db) {
            return callback(null, db)
        }
        var req;
        try {
            req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION)
        } catch (e) {
            return callback(e)
        }
        if (!req) {
            return callback("Unable to connect to IndexedDB")
        }
        req.onupgradeneeded = function(e) {
            var db = e.target.result;
            var transaction = e.target.transaction;
            var fileStore;
            if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
                fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME)
            } else {
                fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME)
            }
            if (!fileStore.indexNames.contains("timestamp")) {
                fileStore.createIndex("timestamp", "timestamp", {
                    unique: false
                })
            }
        };
        req.onsuccess = function() {
            db = req.result;
            IDBFS.dbs[name] = db;
            callback(null, db)
        };
        req.onerror = function(e) {
            callback(this.error);
            e.preventDefault()
        }
    },
    getLocalSet: function(mount, callback) {
        var entries = {};

        function isRealDir(p) {
            return p !== "." && p !== ".."
        }

        function toAbsolute(root) {
            return function(p) {
                return PATH.join2(root, p)
            }
        }
        var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
        while (check.length) {
            var path = check.pop();
            var stat;
            try {
                stat = FS.stat(path)
            } catch (e) {
                return callback(e)
            }
            if (FS.isDir(stat.mode)) {
                check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)))
            }
            entries[path] = {
                timestamp: stat.mtime
            }
        }
        return callback(null, {
            type: "local",
            entries: entries
        })
    },
    getRemoteSet: function(mount, callback) {
        var entries = {};
        IDBFS.getDB(mount.mountpoint, function(err, db) {
            if (err) return callback(err);
            try {
                var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readonly");
                transaction.onerror = function(e) {
                    callback(this.error);
                    e.preventDefault()
                };
                var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
                var index = store.index("timestamp");
                index.openKeyCursor().onsuccess = function(event) {
                    var cursor = event.target.result;
                    if (!cursor) {
                        return callback(null, {
                            type: "remote",
                            db: db,
                            entries: entries
                        })
                    }
                    entries[cursor.primaryKey] = {
                        timestamp: cursor.key
                    };
                    cursor.continue()
                }
            } catch (e) {
                return callback(e)
            }
        })
    },
    loadLocalEntry: function(path, callback) {
        var stat, node;
        try {
            var lookup = FS.lookupPath(path);
            node = lookup.node;
            stat = FS.stat(path)
        } catch (e) {
            return callback(e)
        }
        if (FS.isDir(stat.mode)) {
            return callback(null, {
                timestamp: stat.mtime,
                mode: stat.mode
            })
        } else if (FS.isFile(stat.mode)) {
            node.contents = MEMFS.getFileDataAsTypedArray(node);
            return callback(null, {
                timestamp: stat.mtime,
                mode: stat.mode,
                contents: node.contents
            })
        } else {
            return callback(new Error("node type not supported"))
        }
    },
    storeLocalEntry: function(path, entry, callback) {
        try {
            if (FS.isDir(entry.mode)) {
                FS.mkdir(path, entry.mode)
            } else if (FS.isFile(entry.mode)) {
                FS.writeFile(path, entry.contents, {
                    canOwn: true
                })
            } else {
                return callback(new Error("node type not supported"))
            }
            FS.chmod(path, entry.mode);
            FS.utime(path, entry.timestamp, entry.timestamp)
        } catch (e) {
            return callback(e)
        }
        callback(null)
    },
    removeLocalEntry: function(path, callback) {
        try {
            var lookup = FS.lookupPath(path);
            var stat = FS.stat(path);
            if (FS.isDir(stat.mode)) {
                FS.rmdir(path)
            } else if (FS.isFile(stat.mode)) {
                FS.unlink(path)
            }
        } catch (e) {
            return callback(e)
        }
        callback(null)
    },
    loadRemoteEntry: function(store, path, callback) {
        var req = store.get(path);
        req.onsuccess = function(event) {
            callback(null, event.target.result)
        };
        req.onerror = function(e) {
            callback(this.error);
            e.preventDefault()
        }
    },
    storeRemoteEntry: function(store, path, entry, callback) {
        var req = store.put(entry, path);
        req.onsuccess = function() {
            callback(null)
        };
        req.onerror = function(e) {
            callback(this.error);
            e.preventDefault()
        }
    },
    removeRemoteEntry: function(store, path, callback) {
        var req = store.delete(path);
        req.onsuccess = function() {
            callback(null)
        };
        req.onerror = function(e) {
            callback(this.error);
            e.preventDefault()
        }
    },
    reconcile: function(src, dst, callback) {
        var total = 0;
        var create = [];
        Object.keys(src.entries).forEach(function(key) {
            var e = src.entries[key];
            var e2 = dst.entries[key];
            if (!e2 || e.timestamp > e2.timestamp) {
                create.push(key);
                total++
            }
        });
        var remove = [];
        Object.keys(dst.entries).forEach(function(key) {
            var e = dst.entries[key];
            var e2 = src.entries[key];
            if (!e2) {
                remove.push(key);
                total++
            }
        });
        if (!total) {
            return callback(null)
        }
        var errored = false;
        var db = src.type === "remote" ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], "readwrite");
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);

        function done(err) {
            if (err && !errored) {
                errored = true;
                return callback(err)
            }
        }
        transaction.onerror = function(e) {
            done(this.error);
            e.preventDefault()
        };
        transaction.oncomplete = function(e) {
            if (!errored) {
                callback(null)
            }
        };
        create.sort().forEach(function(path) {
            if (dst.type === "local") {
                IDBFS.loadRemoteEntry(store, path, function(err, entry) {
                    if (err) return done(err);
                    IDBFS.storeLocalEntry(path, entry, done)
                })
            } else {
                IDBFS.loadLocalEntry(path, function(err, entry) {
                    if (err) return done(err);
                    IDBFS.storeRemoteEntry(store, path, entry, done)
                })
            }
        });
        remove.sort().reverse().forEach(function(path) {
            if (dst.type === "local") {
                IDBFS.removeLocalEntry(path, done)
            } else {
                IDBFS.removeRemoteEntry(store, path, done)
            }
        })
    }
};
var FS = {
    root: null,
    mounts: [],
    devices: {},
    streams: [],
    nextInode: 1,
    nameTable: null,
    currentPath: "/",
    initialized: false,
    ignorePermissions: true,
    trackingDelegate: {},
    tracking: {
        openFlags: {
            READ: 1,
            WRITE: 2
        }
    },
    ErrnoError: null,
    genericErrors: {},
    filesystems: null,
    syncFSRequests: 0,
    handleFSError: function(e) {
        if (!(e instanceof FS.ErrnoError)) throw e + " : " + stackTrace();
        return ___setErrNo(e.errno)
    },
    lookupPath: function(path, opts) {
        path = PATH_FS.resolve(FS.cwd(), path);
        opts = opts || {};
        if (!path) return {
            path: "",
            node: null
        };
        var defaults = {
            follow_mount: true,
            recurse_count: 0
        };
        for (var key in defaults) {
            if (opts[key] === undefined) {
                opts[key] = defaults[key]
            }
        }
        if (opts.recurse_count > 8) {
            throw new FS.ErrnoError(32)
        }
        var parts = PATH.normalizeArray(path.split("/").filter(function(p) {
            return !!p
        }), false);
        var current = FS.root;
        var current_path = "/";
        for (var i = 0; i < parts.length; i++) {
            var islast = i === parts.length - 1;
            if (islast && opts.parent) {
                break
            }
            current = FS.lookupNode(current, parts[i]);
            current_path = PATH.join2(current_path, parts[i]);
            if (FS.isMountpoint(current)) {
                if (!islast || islast && opts.follow_mount) {
                    current = current.mounted.root
                }
            }
            if (!islast || opts.follow) {
                var count = 0;
                while (FS.isLink(current.mode)) {
                    var link = FS.readlink(current_path);
                    current_path = PATH_FS.resolve(PATH.dirname(current_path), link);
                    var lookup = FS.lookupPath(current_path, {
                        recurse_count: opts.recurse_count
                    });
                    current = lookup.node;
                    if (count++ > 40) {
                        throw new FS.ErrnoError(32)
                    }
                }
            }
        }
        return {
            path: current_path,
            node: current
        }
    },
    getPath: function(node) {
        var path;
        while (true) {
            if (FS.isRoot(node)) {
                var mount = node.mount.mountpoint;
                if (!path) return mount;
                return mount[mount.length - 1] !== "/" ? mount + "/" + path : mount + path
            }
            path = path ? node.name + "/" + path : node.name;
            node = node.parent
        }
    },
    hashName: function(parentid, name) {
        var hash = 0;
        for (var i = 0; i < name.length; i++) {
            hash = (hash << 5) - hash + name.charCodeAt(i) | 0
        }
        return (parentid + hash >>> 0) % FS.nameTable.length
    },
    hashAddNode: function(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node
    },
    hashRemoveNode: function(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
            FS.nameTable[hash] = node.name_next
        } else {
            var current = FS.nameTable[hash];
            while (current) {
                if (current.name_next === node) {
                    current.name_next = node.name_next;
                    break
                }
                current = current.name_next
            }
        }
    },
    lookupNode: function(parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
            throw new FS.ErrnoError(err, parent)
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
            var nodeName = node.name;
            if (node.parent.id === parent.id && nodeName === name) {
                return node
            }
        }
        return FS.lookup(parent, name)
    },
    createNode: function(parent, name, mode, rdev) {
        if (!FS.FSNode) {
            FS.FSNode = function(parent, name, mode, rdev) {
                if (!parent) {
                    parent = this
                }
                this.parent = parent;
                this.mount = parent.mount;
                this.mounted = null;
                this.id = FS.nextInode++;
                this.name = name;
                this.mode = mode;
                this.node_ops = {};
                this.stream_ops = {};
                this.rdev = rdev
            };
            FS.FSNode.prototype = {};
            var readMode = 292 | 73;
            var writeMode = 146;
            Object.defineProperties(FS.FSNode.prototype, {
                read: {
                    get: function() {
                        return (this.mode & readMode) === readMode
                    },
                    set: function(val) {
                        val ? this.mode |= readMode : this.mode &= ~readMode
                    }
                },
                write: {
                    get: function() {
                        return (this.mode & writeMode) === writeMode
                    },
                    set: function(val) {
                        val ? this.mode |= writeMode : this.mode &= ~writeMode
                    }
                },
                isFolder: {
                    get: function() {
                        return FS.isDir(this.mode)
                    }
                },
                isDevice: {
                    get: function() {
                        return FS.isChrdev(this.mode)
                    }
                }
            })
        }
        var node = new FS.FSNode(parent, name, mode, rdev);
        FS.hashAddNode(node);
        return node
    },
    destroyNode: function(node) {
        FS.hashRemoveNode(node)
    },
    isRoot: function(node) {
        return node === node.parent
    },
    isMountpoint: function(node) {
        return !!node.mounted
    },
    isFile: function(mode) {
        return (mode & 61440) === 32768
    },
    isDir: function(mode) {
        return (mode & 61440) === 16384
    },
    isLink: function(mode) {
        return (mode & 61440) === 40960
    },
    isChrdev: function(mode) {
        return (mode & 61440) === 8192
    },
    isBlkdev: function(mode) {
        return (mode & 61440) === 24576
    },
    isFIFO: function(mode) {
        return (mode & 61440) === 4096
    },
    isSocket: function(mode) {
        return (mode & 49152) === 49152
    },
    flagModes: {
        "r": 0,
        "rs": 1052672,
        "r+": 2,
        "w": 577,
        "wx": 705,
        "xw": 705,
        "w+": 578,
        "wx+": 706,
        "xw+": 706,
        "a": 1089,
        "ax": 1217,
        "xa": 1217,
        "a+": 1090,
        "ax+": 1218,
        "xa+": 1218
    },
    modeStringToFlags: function(str) {
        var flags = FS.flagModes[str];
        if (typeof flags === "undefined") {
            throw new Error("Unknown file open mode: " + str)
        }
        return flags
    },
    flagsToPermissionString: function(flag) {
        var perms = ["r", "w", "rw"][flag & 3];
        if (flag & 512) {
            perms += "w"
        }
        return perms
    },
    nodePermissions: function(node, perms) {
        if (FS.ignorePermissions) {
            return 0
        }
        if (perms.indexOf("r") !== -1 && !(node.mode & 292)) {
            return 2
        } else if (perms.indexOf("w") !== -1 && !(node.mode & 146)) {
            return 2
        } else if (perms.indexOf("x") !== -1 && !(node.mode & 73)) {
            return 2
        }
        return 0
    },
    mayLookup: function(dir) {
        var err = FS.nodePermissions(dir, "x");
        if (err) return err;
        if (!dir.node_ops.lookup) return 2;
        return 0
    },
    mayCreate: function(dir, name) {
        try {
            var node = FS.lookupNode(dir, name);
            return 20
        } catch (e) {}
        return FS.nodePermissions(dir, "wx")
    },
    mayDelete: function(dir, name, isdir) {
        var node;
        try {
            node = FS.lookupNode(dir, name)
        } catch (e) {
            return e.errno
        }
        var err = FS.nodePermissions(dir, "wx");
        if (err) {
            return err
        }
        if (isdir) {
            if (!FS.isDir(node.mode)) {
                return 54
            }
            if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
                return 10
            }
        } else {
            if (FS.isDir(node.mode)) {
                return 31
            }
        }
        return 0
    },
    mayOpen: function(node, flags) {
        if (!node) {
            return 44
        }
        if (FS.isLink(node.mode)) {
            return 32
        } else if (FS.isDir(node.mode)) {
            if (FS.flagsToPermissionString(flags) !== "r" || flags & 512) {
                return 31
            }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags))
    },
    MAX_OPEN_FDS: 4096,
    nextfd: function(fd_start, fd_end) {
        fd_start = fd_start || 0;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
            if (!FS.streams[fd]) {
                return fd
            }
        }
        throw new FS.ErrnoError(33)
    },
    getStream: function(fd) {
        return FS.streams[fd]
    },
    createStream: function(stream, fd_start, fd_end) {
        if (!FS.FSStream) {
            FS.FSStream = function() {};
            FS.FSStream.prototype = {};
            Object.defineProperties(FS.FSStream.prototype, {
                object: {
                    get: function() {
                        return this.node
                    },
                    set: function(val) {
                        this.node = val
                    }
                },
                isRead: {
                    get: function() {
                        return (this.flags & 2097155) !== 1
                    }
                },
                isWrite: {
                    get: function() {
                        return (this.flags & 2097155) !== 0
                    }
                },
                isAppend: {
                    get: function() {
                        return this.flags & 1024
                    }
                }
            })
        }
        var newStream = new FS.FSStream;
        for (var p in stream) {
            newStream[p] = stream[p]
        }
        stream = newStream;
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream
    },
    closeStream: function(fd) {
        FS.streams[fd] = null
    },
    chrdev_stream_ops: {
        open: function(stream) {
            var device = FS.getDevice(stream.node.rdev);
            stream.stream_ops = device.stream_ops;
            if (stream.stream_ops.open) {
                stream.stream_ops.open(stream)
            }
        },
        llseek: function() {
            throw new FS.ErrnoError(70)
        }
    },
    major: function(dev) {
        return dev >> 8
    },
    minor: function(dev) {
        return dev & 255
    },
    makedev: function(ma, mi) {
        return ma << 8 | mi
    },
    registerDevice: function(dev, ops) {
        FS.devices[dev] = {
            stream_ops: ops
        }
    },
    getDevice: function(dev) {
        return FS.devices[dev]
    },
    getMounts: function(mount) {
        var mounts = [];
        var check = [mount];
        while (check.length) {
            var m = check.pop();
            mounts.push(m);
            check.push.apply(check, m.mounts)
        }
        return mounts
    },
    syncfs: function(populate, callback) {
        if (typeof populate === "function") {
            callback = populate;
            populate = false
        }
        FS.syncFSRequests++;
        if (FS.syncFSRequests > 1) {
            console.log("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work")
        }
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;

        function doCallback(err) {
            FS.syncFSRequests--;
            return callback(err)
        }

        function done(err) {
            if (err) {
                if (!done.errored) {
                    done.errored = true;
                    return doCallback(err)
                }
                return
            }
            if (++completed >= mounts.length) {
                doCallback(null)
            }
        }
        mounts.forEach(function(mount) {
            if (!mount.type.syncfs) {
                return done(null)
            }
            mount.type.syncfs(mount, populate, done)
        })
    },
    mount: function(type, opts, mountpoint) {
        var root = mountpoint === "/";
        var pseudo = !mountpoint;
        var node;
        if (root && FS.root) {
            throw new FS.ErrnoError(10)
        } else if (!root && !pseudo) {
            var lookup = FS.lookupPath(mountpoint, {
                follow_mount: false
            });
            mountpoint = lookup.path;
            node = lookup.node;
            if (FS.isMountpoint(node)) {
                throw new FS.ErrnoError(10)
            }
            if (!FS.isDir(node.mode)) {
                throw new FS.ErrnoError(54)
            }
        }
        var mount = {
            type: type,
            opts: opts,
            mountpoint: mountpoint,
            mounts: []
        };
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
        if (root) {
            FS.root = mountRoot
        } else if (node) {
            node.mounted = mount;
            if (node.mount) {
                node.mount.mounts.push(mount)
            }
        }
        return mountRoot
    },
    unmount: function(mountpoint) {
        var lookup = FS.lookupPath(mountpoint, {
            follow_mount: false
        });
        if (!FS.isMountpoint(lookup.node)) {
            throw new FS.ErrnoError(28)
        }
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
        Object.keys(FS.nameTable).forEach(function(hash) {
            var current = FS.nameTable[hash];
            while (current) {
                var next = current.name_next;
                if (mounts.indexOf(current.mount) !== -1) {
                    FS.destroyNode(current)
                }
                current = next
            }
        });
        node.mounted = null;
        var idx = node.mount.mounts.indexOf(mount);
        node.mount.mounts.splice(idx, 1)
    },
    lookup: function(parent, name) {
        return parent.node_ops.lookup(parent, name)
    },
    mknod: function(path, mode, dev) {
        var lookup = FS.lookupPath(path, {
            parent: true
        });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name || name === "." || name === "..") {
            throw new FS.ErrnoError(28)
        }
        var err = FS.mayCreate(parent, name);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        if (!parent.node_ops.mknod) {
            throw new FS.ErrnoError(63)
        }
        return parent.node_ops.mknod(parent, name, mode, dev)
    },
    create: function(path, mode) {
        mode = mode !== undefined ? mode : 438;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0)
    },
    mkdir: function(path, mode) {
        mode = mode !== undefined ? mode : 511;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0)
    },
    mkdirTree: function(path, mode) {
        var dirs = path.split("/");
        var d = "";
        for (var i = 0; i < dirs.length; ++i) {
            if (!dirs[i]) continue;
            d += "/" + dirs[i];
            try {
                FS.mkdir(d, mode)
            } catch (e) {
                if (e.errno != 20) throw e
            }
        }
    },
    mkdev: function(path, mode, dev) {
        if (typeof dev === "undefined") {
            dev = mode;
            mode = 438
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev)
    },
    symlink: function(oldpath, newpath) {
        if (!PATH_FS.resolve(oldpath)) {
            throw new FS.ErrnoError(44)
        }
        var lookup = FS.lookupPath(newpath, {
            parent: true
        });
        var parent = lookup.node;
        if (!parent) {
            throw new FS.ErrnoError(44)
        }
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        if (!parent.node_ops.symlink) {
            throw new FS.ErrnoError(63)
        }
        return parent.node_ops.symlink(parent, newname, oldpath)
    },
    rename: function(old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        var lookup, old_dir, new_dir;
        try {
            lookup = FS.lookupPath(old_path, {
                parent: true
            });
            old_dir = lookup.node;
            lookup = FS.lookupPath(new_path, {
                parent: true
            });
            new_dir = lookup.node
        } catch (e) {
            throw new FS.ErrnoError(10)
        }
        if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
        if (old_dir.mount !== new_dir.mount) {
            throw new FS.ErrnoError(75)
        }
        var old_node = FS.lookupNode(old_dir, old_name);
        var relative = PATH_FS.relative(old_path, new_dirname);
        if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(28)
        }
        relative = PATH_FS.relative(new_path, old_dirname);
        if (relative.charAt(0) !== ".") {
            throw new FS.ErrnoError(55)
        }
        var new_node;
        try {
            new_node = FS.lookupNode(new_dir, new_name)
        } catch (e) {}
        if (old_node === new_node) {
            return
        }
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        err = new_node ? FS.mayDelete(new_dir, new_name, isdir) : FS.mayCreate(new_dir, new_name);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        if (!old_dir.node_ops.rename) {
            throw new FS.ErrnoError(63)
        }
        if (FS.isMountpoint(old_node) || new_node && FS.isMountpoint(new_node)) {
            throw new FS.ErrnoError(10)
        }
        if (new_dir !== old_dir) {
            err = FS.nodePermissions(old_dir, "w");
            if (err) {
                throw new FS.ErrnoError(err)
            }
        }
        try {
            if (FS.trackingDelegate["willMovePath"]) {
                FS.trackingDelegate["willMovePath"](old_path, new_path)
            }
        } catch (e) {
            console.log("FS.trackingDelegate['willMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message)
        }
        FS.hashRemoveNode(old_node);
        try {
            old_dir.node_ops.rename(old_node, new_dir, new_name)
        } catch (e) {
            throw e
        } finally {
            FS.hashAddNode(old_node)
        }
        try {
            if (FS.trackingDelegate["onMovePath"]) FS.trackingDelegate["onMovePath"](old_path, new_path)
        } catch (e) {
            console.log("FS.trackingDelegate['onMovePath']('" + old_path + "', '" + new_path + "') threw an exception: " + e.message)
        }
    },
    rmdir: function(path) {
        var lookup = FS.lookupPath(path, {
            parent: true
        });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        if (!parent.node_ops.rmdir) {
            throw new FS.ErrnoError(63)
        }
        if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10)
        }
        try {
            if (FS.trackingDelegate["willDeletePath"]) {
                FS.trackingDelegate["willDeletePath"](path)
            }
        } catch (e) {
            console.log("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message)
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
        try {
            if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path)
        } catch (e) {
            console.log("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message)
        }
    },
    readdir: function(path) {
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
            throw new FS.ErrnoError(54)
        }
        return node.node_ops.readdir(node)
    },
    unlink: function(path) {
        var lookup = FS.lookupPath(path, {
            parent: true
        });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
            throw new FS.ErrnoError(err)
        }
        if (!parent.node_ops.unlink) {
            throw new FS.ErrnoError(63)
        }
        if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10)
        }
        try {
            if (FS.trackingDelegate["willDeletePath"]) {
                FS.trackingDelegate["willDeletePath"](path)
            }
        } catch (e) {
            console.log("FS.trackingDelegate['willDeletePath']('" + path + "') threw an exception: " + e.message)
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
        try {
            if (FS.trackingDelegate["onDeletePath"]) FS.trackingDelegate["onDeletePath"](path)
        } catch (e) {
            console.log("FS.trackingDelegate['onDeletePath']('" + path + "') threw an exception: " + e.message)
        }
    },
    readlink: function(path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
            throw new FS.ErrnoError(44)
        }
        if (!link.node_ops.readlink) {
            throw new FS.ErrnoError(28)
        }
        return PATH_FS.resolve(FS.getPath(link.parent), link.node_ops.readlink(link))
    },
    stat: function(path, dontFollow) {
        var lookup = FS.lookupPath(path, {
            follow: !dontFollow
        });
        var node = lookup.node;
        if (!node) {
            throw new FS.ErrnoError(44)
        }
        if (!node.node_ops.getattr) {
            throw new FS.ErrnoError(63)
        }
        return node.node_ops.getattr(node)
    },
    lstat: function(path) {
        return FS.stat(path, true)
    },
    chmod: function(path, mode, dontFollow) {
        var node;
        if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {
                follow: !dontFollow
            });
            node = lookup.node
        } else {
            node = path
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63)
        }
        node.node_ops.setattr(node, {
            mode: mode & 4095 | node.mode & ~4095,
            timestamp: Date.now()
        })
    },
    lchmod: function(path, mode) {
        FS.chmod(path, mode, true)
    },
    fchmod: function(fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(8)
        }
        FS.chmod(stream.node, mode)
    },
    chown: function(path, uid, gid, dontFollow) {
        var node;
        if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {
                follow: !dontFollow
            });
            node = lookup.node
        } else {
            node = path
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63)
        }
        node.node_ops.setattr(node, {
            timestamp: Date.now()
        })
    },
    lchown: function(path, uid, gid) {
        FS.chown(path, uid, gid, true)
    },
    fchown: function(fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(8)
        }
        FS.chown(stream.node, uid, gid)
    },
    truncate: function(path, len) {
        if (len < 0) {
            throw new FS.ErrnoError(28)
        }
        var node;
        if (typeof path === "string") {
            var lookup = FS.lookupPath(path, {
                follow: true
            });
            node = lookup.node
        } else {
            node = path
        }
        if (!node.node_ops.setattr) {
            throw new FS.ErrnoError(63)
        }
        if (FS.isDir(node.mode)) {
            throw new FS.ErrnoError(31)
        }
        if (!FS.isFile(node.mode)) {
            throw new FS.ErrnoError(28)
        }
        var err = FS.nodePermissions(node, "w");
        if (err) {
            throw new FS.ErrnoError(err)
        }
        node.node_ops.setattr(node, {
            size: len,
            timestamp: Date.now()
        })
    },
    ftruncate: function(fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
            throw new FS.ErrnoError(8)
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(28)
        }
        FS.truncate(stream.node, len)
    },
    utime: function(path, atime, mtime) {
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        var node = lookup.node;
        node.node_ops.setattr(node, {
            timestamp: Math.max(atime, mtime)
        })
    },
    open: function(path, flags, mode, fd_start, fd_end) {
        if (path === "") {
            throw new FS.ErrnoError(44)
        }
        flags = typeof flags === "string" ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === "undefined" ? 438 : mode;
        if (flags & 64) {
            mode = mode & 4095 | 32768
        } else {
            mode = 0
        }
        var node;
        if (typeof path === "object") {
            node = path
        } else {
            path = PATH.normalize(path);
            try {
                var lookup = FS.lookupPath(path, {
                    follow: !(flags & 131072)
                });
                node = lookup.node
            } catch (e) {}
        }
        var created = false;
        if (flags & 64) {
            if (node) {
                if (flags & 128) {
                    throw new FS.ErrnoError(20)
                }
            } else {
                node = FS.mknod(path, mode, 0);
                created = true
            }
        }
        if (!node) {
            throw new FS.ErrnoError(44)
        }
        if (FS.isChrdev(node.mode)) {
            flags &= ~512
        }
        if (flags & 65536 && !FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54)
        }
        if (!created) {
            var err = FS.mayOpen(node, flags);
            if (err) {
                throw new FS.ErrnoError(err)
            }
        }
        if (flags & 512) {
            FS.truncate(node, 0)
        }
        flags &= ~(128 | 512);
        var stream = FS.createStream({
            node: node,
            path: FS.getPath(node),
            flags: flags,
            seekable: true,
            position: 0,
            stream_ops: node.stream_ops,
            ungotten: [],
            error: false
        }, fd_start, fd_end);
        if (stream.stream_ops.open) {
            stream.stream_ops.open(stream)
        }
        if (Module["logReadFiles"] && !(flags & 1)) {
            if (!FS.readFiles) FS.readFiles = {};
            if (!(path in FS.readFiles)) {
                FS.readFiles[path] = 1;
                console.log("FS.trackingDelegate error on read file: " + path)
            }
        }
        try {
            if (FS.trackingDelegate["onOpenFile"]) {
                var trackingFlags = 0;
                if ((flags & 2097155) !== 1) {
                    trackingFlags |= FS.tracking.openFlags.READ
                }
                if ((flags & 2097155) !== 0) {
                    trackingFlags |= FS.tracking.openFlags.WRITE
                }
                FS.trackingDelegate["onOpenFile"](path, trackingFlags)
            }
        } catch (e) {
            console.log("FS.trackingDelegate['onOpenFile']('" + path + "', flags) threw an exception: " + e.message)
        }
        return stream
    },
    close: function(stream) {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
        }
        if (stream.getdents) stream.getdents = null;
        try {
            if (stream.stream_ops.close) {
                stream.stream_ops.close(stream)
            }
        } catch (e) {
            throw e
        } finally {
            FS.closeStream(stream.fd)
        }
        stream.fd = null
    },
    isClosed: function(stream) {
        return stream.fd === null
    },
    llseek: function(stream, offset, whence) {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
            throw new FS.ErrnoError(70)
        }
        if (whence != 0 && whence != 1 && whence != 2) {
            throw new FS.ErrnoError(28)
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position
    },
    read: function(stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28)
        }
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
        }
        if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(8)
        }
        if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31)
        }
        if (!stream.stream_ops.read) {
            throw new FS.ErrnoError(28)
        }
        var seeking = typeof position !== "undefined";
        if (!seeking) {
            position = stream.position
        } else if (!stream.seekable) {
            throw new FS.ErrnoError(70)
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead
    },
    write: function(stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
            throw new FS.ErrnoError(28)
        }
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8)
        }
        if (FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(31)
        }
        if (!stream.stream_ops.write) {
            throw new FS.ErrnoError(28)
        }
        if (stream.flags & 1024) {
            FS.llseek(stream, 0, 2)
        }
        var seeking = typeof position !== "undefined";
        if (!seeking) {
            position = stream.position
        } else if (!stream.seekable) {
            throw new FS.ErrnoError(70)
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        try {
            if (stream.path && FS.trackingDelegate["onWriteToFile"]) FS.trackingDelegate["onWriteToFile"](stream.path)
        } catch (e) {
            console.log("FS.trackingDelegate['onWriteToFile']('" + stream.path + "') threw an exception: " + e.message)
        }
        return bytesWritten
    },
    allocate: function(stream, offset, length) {
        if (FS.isClosed(stream)) {
            throw new FS.ErrnoError(8)
        }
        if (offset < 0 || length <= 0) {
            throw new FS.ErrnoError(28)
        }
        if ((stream.flags & 2097155) === 0) {
            throw new FS.ErrnoError(8)
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(stream.node.mode)) {
            throw new FS.ErrnoError(43)
        }
        if (!stream.stream_ops.allocate) {
            throw new FS.ErrnoError(138)
        }
        stream.stream_ops.allocate(stream, offset, length)
    },
    mmap: function(stream, buffer, offset, length, position, prot, flags) {
        if ((prot & 2) !== 0 && (flags & 2) === 0 && (stream.flags & 2097155) !== 2) {
            throw new FS.ErrnoError(2)
        }
        if ((stream.flags & 2097155) === 1) {
            throw new FS.ErrnoError(2)
        }
        if (!stream.stream_ops.mmap) {
            throw new FS.ErrnoError(43)
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags)
    },
    msync: function(stream, buffer, offset, length, mmapFlags) {
        if (!stream || !stream.stream_ops.msync) {
            return 0
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags)
    },
    munmap: function(stream) {
        return 0
    },
    ioctl: function(stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
            throw new FS.ErrnoError(59)
        }
        return stream.stream_ops.ioctl(stream, cmd, arg)
    },
    readFile: function(path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || "r";
        opts.encoding = opts.encoding || "binary";
        if (opts.encoding !== "utf8" && opts.encoding !== "binary") {
            throw new Error('Invalid encoding type "' + opts.encoding + '"')
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === "utf8") {
            ret = UTF8ArrayToString(buf, 0)
        } else if (opts.encoding === "binary") {
            ret = buf
        }
        FS.close(stream);
        return ret
    },
    writeFile: function(path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || "w";
        var stream = FS.open(path, opts.flags, opts.mode);
        if (typeof data === "string") {
            var buf = new Uint8Array(lengthBytesUTF8(data) + 1);
            var actualNumBytes = stringToUTF8Array(data, buf, 0, buf.length);
            FS.write(stream, buf, 0, actualNumBytes, undefined, opts.canOwn)
        } else if (ArrayBuffer.isView(data)) {
            FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn)
        } else {
            throw new Error("Unsupported data type")
        }
        FS.close(stream)
    },
    cwd: function() {
        return FS.currentPath
    },
    chdir: function(path) {
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        if (lookup.node === null) {
            throw new FS.ErrnoError(44)
        }
        if (!FS.isDir(lookup.node.mode)) {
            throw new FS.ErrnoError(54)
        }
        var err = FS.nodePermissions(lookup.node, "x");
        if (err) {
            throw new FS.ErrnoError(err)
        }
        FS.currentPath = lookup.path
    },
    createDefaultDirectories: function() {
        FS.mkdir("/tmp");
        FS.mkdir("/home");
        FS.mkdir("/home/web_user")
    },
    createDefaultDevices: function() {
        FS.mkdir("/dev");
        FS.registerDevice(FS.makedev(1, 3), {
            read: function() {
                return 0
            },
            write: function(stream, buffer, offset, length, pos) {
                return length
            }
        });
        FS.mkdev("/dev/null", FS.makedev(1, 3));
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev("/dev/tty", FS.makedev(5, 0));
        FS.mkdev("/dev/tty1", FS.makedev(6, 0));
        var random_device;
        if (typeof crypto === "object" && typeof crypto["getRandomValues"] === "function") {
            var randomBuffer = new Uint8Array(1);
            random_device = function() {
                crypto.getRandomValues(randomBuffer);
                return randomBuffer[0]
            }
        } else if (ENVIRONMENT_IS_NODE) {
            try {
                var crypto_module = require("crypto");
                random_device = function() {
                    return crypto_module["randomBytes"](1)[0]
                }
            } catch (e) {}
        } else {}
        if (!random_device) {
            random_device = function() {
                abort("random_device")
            }
        }
        FS.createDevice("/dev", "random", random_device);
        FS.createDevice("/dev", "urandom", random_device);
        FS.mkdir("/dev/shm");
        FS.mkdir("/dev/shm/tmp")
    },
    createSpecialDirectories: function() {
        FS.mkdir("/proc");
        FS.mkdir("/proc/self");
        FS.mkdir("/proc/self/fd");
        FS.mount({
            mount: function() {
                var node = FS.createNode("/proc/self", "fd", 16384 | 511, 73);
                node.node_ops = {
                    lookup: function(parent, name) {
                        var fd = +name;
                        var stream = FS.getStream(fd);
                        if (!stream) throw new FS.ErrnoError(8);
                        var ret = {
                            parent: null,
                            mount: {
                                mountpoint: "fake"
                            },
                            node_ops: {
                                readlink: function() {
                                    return stream.path
                                }
                            }
                        };
                        ret.parent = ret;
                        return ret
                    }
                };
                return node
            }
        }, {}, "/proc/self/fd")
    },
    createStandardStreams: function() {
        if (Module["stdin"]) {
            FS.createDevice("/dev", "stdin", Module["stdin"])
        } else {
            FS.symlink("/dev/tty", "/dev/stdin")
        }
        if (Module["stdout"]) {
            FS.createDevice("/dev", "stdout", null, Module["stdout"])
        } else {
            FS.symlink("/dev/tty", "/dev/stdout")
        }
        if (Module["stderr"]) {
            FS.createDevice("/dev", "stderr", null, Module["stderr"])
        } else {
            FS.symlink("/dev/tty1", "/dev/stderr")
        }
        var stdin = FS.open("/dev/stdin", "r");
        var stdout = FS.open("/dev/stdout", "w");
        var stderr = FS.open("/dev/stderr", "w")
    },
    ensureErrnoError: function() {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno, node) {
            this.node = node;
            this.setErrno = function(errno) {
                this.errno = errno
            };
            this.setErrno(errno);
            this.message = "FS error"
        };
        FS.ErrnoError.prototype = new Error;
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        [44].forEach(function(code) {
            FS.genericErrors[code] = new FS.ErrnoError(code);
            FS.genericErrors[code].stack = "<generic error, no stack>"
        })
    },
    staticInit: function() {
        FS.ensureErrnoError();
        FS.nameTable = new Array(4096);
        FS.mount(MEMFS, {}, "/");
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
        FS.filesystems = {
            "MEMFS": MEMFS,
            "IDBFS": IDBFS
        }
    },
    init: function(input, output, error) {
        FS.init.initialized = true;
        FS.ensureErrnoError();
        Module["stdin"] = input || Module["stdin"];
        Module["stdout"] = output || Module["stdout"];
        Module["stderr"] = error || Module["stderr"];
        FS.createStandardStreams()
    },
    quit: function() {
        FS.init.initialized = false;
        var fflush = Module["_fflush"];
        if (fflush) fflush(0);
        for (var i = 0; i < FS.streams.length; i++) {
            var stream = FS.streams[i];
            if (!stream) {
                continue
            }
            FS.close(stream)
        }
    },
    getMode: function(canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode
    },
    joinPath: function(parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == "/") path = path.substr(1);
        return path
    },
    absolutePath: function(relative, base) {
        return PATH_FS.resolve(base, relative)
    },
    standardizePath: function(path) {
        return PATH.normalize(path)
    },
    findObject: function(path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
            return ret.object
        } else {
            ___setErrNo(ret.error);
            return null
        }
    },
    analyzePath: function(path, dontResolveLastLink) {
        try {
            var lookup = FS.lookupPath(path, {
                follow: !dontResolveLastLink
            });
            path = lookup.path
        } catch (e) {}
        var ret = {
            isRoot: false,
            exists: false,
            error: 0,
            name: null,
            path: null,
            object: null,
            parentExists: false,
            parentPath: null,
            parentObject: null
        };
        try {
            var lookup = FS.lookupPath(path, {
                parent: true
            });
            ret.parentExists = true;
            ret.parentPath = lookup.path;
            ret.parentObject = lookup.node;
            ret.name = PATH.basename(path);
            lookup = FS.lookupPath(path, {
                follow: !dontResolveLastLink
            });
            ret.exists = true;
            ret.path = lookup.path;
            ret.object = lookup.node;
            ret.name = lookup.node.name;
            ret.isRoot = lookup.path === "/"
        } catch (e) {
            ret.error = e.errno
        }
        return ret
    },
    createFolder: function(parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode)
    },
    createPath: function(parent, path, canRead, canWrite) {
        parent = typeof parent === "string" ? parent : FS.getPath(parent);
        var parts = path.split("/").reverse();
        while (parts.length) {
            var part = parts.pop();
            if (!part) continue;
            var current = PATH.join2(parent, part);
            try {
                FS.mkdir(current)
            } catch (e) {}
            parent = current
        }
        return current
    },
    createFile: function(parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode)
    },
    createDataFile: function(parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
            if (typeof data === "string") {
                var arr = new Array(data.length);
                for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
                data = arr
            }
            FS.chmod(node, mode | 146);
            var stream = FS.open(node, "w");
            FS.write(stream, data, 0, data.length, 0, canOwn);
            FS.close(stream);
            FS.chmod(node, mode)
        }
        return node
    },
    createDevice: function(parent, name, input, output) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        FS.registerDevice(dev, {
            open: function(stream) {
                stream.seekable = false
            },
            close: function(stream) {
                if (output && output.buffer && output.buffer.length) {
                    output(10)
                }
            },
            read: function(stream, buffer, offset, length, pos) {
                var bytesRead = 0;
                for (var i = 0; i < length; i++) {
                    var result;
                    try {
                        result = input()
                    } catch (e) {
                        throw new FS.ErrnoError(29)
                    }
                    if (result === undefined && bytesRead === 0) {
                        throw new FS.ErrnoError(6)
                    }
                    if (result === null || result === undefined) break;
                    bytesRead++;
                    buffer[offset + i] = result
                }
                if (bytesRead) {
                    stream.node.timestamp = Date.now()
                }
                return bytesRead
            },
            write: function(stream, buffer, offset, length, pos) {
                for (var i = 0; i < length; i++) {
                    try {
                        output(buffer[offset + i])
                    } catch (e) {
                        throw new FS.ErrnoError(29)
                    }
                }
                if (length) {
                    stream.node.timestamp = Date.now()
                }
                return i
            }
        });
        return FS.mkdev(path, mode, dev)
    },
    createLink: function(parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === "string" ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path)
    },
    forceLoadFile: function(obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== "undefined") {
            throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.")
        } else if (read_) {
            try {
                obj.contents = intArrayFromString(read_(obj.url), true);
                obj.usedBytes = obj.contents.length
            } catch (e) {
                success = false
            }
        } else {
            throw new Error("Cannot load without read() or XMLHttpRequest.")
        }
        if (!success) ___setErrNo(29);
        return success
    },
    createLazyFile: function(parent, name, url, canRead, canWrite) {
        function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = []
        }
        LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
            if (idx > this.length - 1 || idx < 0) {
                return undefined
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = idx / this.chunkSize | 0;
            return this.getter(chunkNum)[chunkOffset]
        };
        LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter
        };
        LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
            var xhr = new XMLHttpRequest;
            xhr.open("HEAD", url, false);
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
            var datalength = Number(xhr.getResponseHeader("Content-length"));
            var header;
            var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
            var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
            var chunkSize = 1024 * 1024;
            if (!hasByteServing) chunkSize = datalength;
            var doXHR = function(from, to) {
                if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength - 1) throw new Error("only " + datalength + " bytes available! programmer error!");
                var xhr = new XMLHttpRequest;
                xhr.open("GET", url, false);
                if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
                if (typeof Uint8Array != "undefined") xhr.responseType = "arraybuffer";
                if (xhr.overrideMimeType) {
                    xhr.overrideMimeType("text/plain; charset=x-user-defined")
                }
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                if (xhr.response !== undefined) {
                    return new Uint8Array(xhr.response || [])
                } else {
                    return intArrayFromString(xhr.responseText || "", true)
                }
            };
            var lazyArray = this;
            lazyArray.setDataGetter(function(chunkNum) {
                var start = chunkNum * chunkSize;
                var end = (chunkNum + 1) * chunkSize - 1;
                end = Math.min(end, datalength - 1);
                if (typeof lazyArray.chunks[chunkNum] === "undefined") {
                    lazyArray.chunks[chunkNum] = doXHR(start, end)
                }
                if (typeof lazyArray.chunks[chunkNum] === "undefined") throw new Error("doXHR failed!");
                return lazyArray.chunks[chunkNum]
            });
            if (usesGzip || !datalength) {
                chunkSize = datalength = 1;
                datalength = this.getter(0).length;
                chunkSize = datalength;
                console.log("LazyFiles on gzip forces download of the whole file when length is accessed")
            }
            this._length = datalength;
            this._chunkSize = chunkSize;
            this.lengthKnown = true
        };
        if (typeof XMLHttpRequest !== "undefined") {
            if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
            var lazyArray = new LazyUint8Array;
            Object.defineProperties(lazyArray, {
                length: {
                    get: function() {
                        if (!this.lengthKnown) {
                            this.cacheLength()
                        }
                        return this._length
                    }
                },
                chunkSize: {
                    get: function() {
                        if (!this.lengthKnown) {
                            this.cacheLength()
                        }
                        return this._chunkSize
                    }
                }
            });
            var properties = {
                isDevice: false,
                contents: lazyArray
            }
        } else {
            var properties = {
                isDevice: false,
                url: url
            }
        }
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        if (properties.contents) {
            node.contents = properties.contents
        } else if (properties.url) {
            node.contents = null;
            node.url = properties.url
        }
        Object.defineProperties(node, {
            usedBytes: {
                get: function() {
                    return this.contents.length
                }
            }
        });
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
            var fn = node.stream_ops[key];
            stream_ops[key] = function forceLoadLazyFile() {
                if (!FS.forceLoadFile(node)) {
                    throw new FS.ErrnoError(29)
                }
                return fn.apply(null, arguments)
            }
        });
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
            if (!FS.forceLoadFile(node)) {
                throw new FS.ErrnoError(29)
            }
            var contents = stream.node.contents;
            if (position >= contents.length) return 0;
            var size = Math.min(contents.length - position, length);
            if (contents.slice) {
                for (var i = 0; i < size; i++) {
                    buffer[offset + i] = contents[position + i]
                }
            } else {
                for (var i = 0; i < size; i++) {
                    buffer[offset + i] = contents.get(position + i)
                }
            }
            return size
        };
        node.stream_ops = stream_ops;
        return node
    },
    createPreloadedFile: function(parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) {
        Browser.init();
        var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
        var dep = getUniqueRunDependency("cp " + fullname);

        function processData(byteArray) {
            function finish(byteArray) {
                if (preFinish) preFinish();
                if (!dontCreateFile) {
                    FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn)
                }
                if (onload) onload();
                removeRunDependency(dep)
            }
            var handled = false;
            Module["preloadPlugins"].forEach(function(plugin) {
                if (handled) return;
                if (plugin["canHandle"](fullname)) {
                    plugin["handle"](byteArray, fullname, finish, function() {
                        if (onerror) onerror();
                        removeRunDependency(dep)
                    });
                    handled = true
                }
            });
            if (!handled) finish(byteArray)
        }
        addRunDependency(dep);
        if (typeof url == "string") {
            Browser.asyncLoad(url, function(byteArray) {
                processData(byteArray)
            }, onerror)
        } else {
            processData(url)
        }
    },
    indexedDB: function() {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
    },
    DB_NAME: function() {
        return "EM_FS_" + window.location.pathname
    },
    DB_VERSION: 20,
    DB_STORE_NAME: "FILE_DATA",
    saveFilesToDB: function(paths, onload, onerror) {
        onload = onload || function() {};
        onerror = onerror || function() {};
        var indexedDB = FS.indexedDB();
        try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
        } catch (e) {
            return onerror(e)
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
            console.log("creating db");
            var db = openRequest.result;
            db.createObjectStore(FS.DB_STORE_NAME)
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
            var db = openRequest.result;
            var transaction = db.transaction([FS.DB_STORE_NAME], "readwrite");
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0,
                fail = 0,
                total = paths.length;

            function finish() {
                if (fail == 0) onload();
                else onerror()
            }
            paths.forEach(function(path) {
                var putRequest = files.put(FS.analyzePath(path).object.contents, path);
                putRequest.onsuccess = function putRequest_onsuccess() {
                    ok++;
                    if (ok + fail == total) finish()
                };
                putRequest.onerror = function putRequest_onerror() {
                    fail++;
                    if (ok + fail == total) finish()
                }
            });
            transaction.onerror = onerror
        };
        openRequest.onerror = onerror
    },
    loadFilesFromDB: function(paths, onload, onerror) {
        onload = onload || function() {};
        onerror = onerror || function() {};
        var indexedDB = FS.indexedDB();
        try {
            var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION)
        } catch (e) {
            return onerror(e)
        }
        openRequest.onupgradeneeded = onerror;
        openRequest.onsuccess = function openRequest_onsuccess() {
            var db = openRequest.result;
            try {
                var transaction = db.transaction([FS.DB_STORE_NAME], "readonly")
            } catch (e) {
                onerror(e);
                return
            }
            var files = transaction.objectStore(FS.DB_STORE_NAME);
            var ok = 0,
                fail = 0,
                total = paths.length;

            function finish() {
                if (fail == 0) onload();
                else onerror()
            }
            paths.forEach(function(path) {
                var getRequest = files.get(path);
                getRequest.onsuccess = function getRequest_onsuccess() {
                    if (FS.analyzePath(path).exists) {
                        FS.unlink(path)
                    }
                    FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
                    ok++;
                    if (ok + fail == total) finish()
                };
                getRequest.onerror = function getRequest_onerror() {
                    fail++;
                    if (ok + fail == total) finish()
                }
            });
            transaction.onerror = onerror
        };
        openRequest.onerror = onerror
    }
};
var SYSCALLS = {
    DEFAULT_POLLMASK: 5,
    mappings: {},
    umask: 511,
    calculateAt: function(dirfd, path) {
        if (path[0] !== "/") {
            var dir;
            if (dirfd === -100) {
                dir = FS.cwd()
            } else {
                var dirstream = FS.getStream(dirfd);
                if (!dirstream) throw new FS.ErrnoError(8);
                dir = dirstream.path
            }
            path = PATH.join2(dir, path)
        }
        return path
    },
    doStat: function(func, path, buf) {
        try {
            var stat = func(path)
        } catch (e) {
            if (e && e.node && PATH.normalize(path) !== PATH.normalize(FS.getPath(e.node))) {
                return -54
            }
            throw e
        }
        HEAP32[buf >> 2] = stat.dev;
        HEAP32[buf + 4 >> 2] = 0;
        HEAP32[buf + 8 >> 2] = stat.ino;
        HEAP32[buf + 12 >> 2] = stat.mode;
        HEAP32[buf + 16 >> 2] = stat.nlink;
        HEAP32[buf + 20 >> 2] = stat.uid;
        HEAP32[buf + 24 >> 2] = stat.gid;
        HEAP32[buf + 28 >> 2] = stat.rdev;
        HEAP32[buf + 32 >> 2] = 0;
        tempI64 = [stat.size >>> 0, (tempDouble = stat.size, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 40 >> 2] = tempI64[0], HEAP32[buf + 44 >> 2] = tempI64[1];
        HEAP32[buf + 48 >> 2] = 4096;
        HEAP32[buf + 52 >> 2] = stat.blocks;
        HEAP32[buf + 56 >> 2] = stat.atime.getTime() / 1e3 | 0;
        HEAP32[buf + 60 >> 2] = 0;
        HEAP32[buf + 64 >> 2] = stat.mtime.getTime() / 1e3 | 0;
        HEAP32[buf + 68 >> 2] = 0;
        HEAP32[buf + 72 >> 2] = stat.ctime.getTime() / 1e3 | 0;
        HEAP32[buf + 76 >> 2] = 0;
        tempI64 = [stat.ino >>> 0, (tempDouble = stat.ino, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[buf + 80 >> 2] = tempI64[0], HEAP32[buf + 84 >> 2] = tempI64[1];
        return 0
    },
    doMsync: function(addr, stream, len, flags) {
        var buffer = new Uint8Array(HEAPU8.subarray(addr, addr + len));
        FS.msync(stream, buffer, 0, len, flags)
    },
    doMkdir: function(path, mode) {
        path = PATH.normalize(path);
        if (path[path.length - 1] === "/") path = path.substr(0, path.length - 1);
        FS.mkdir(path, mode, 0);
        return 0
    },
    doMknod: function(path, mode, dev) {
        switch (mode & 61440) {
            case 32768:
            case 8192:
            case 24576:
            case 4096:
            case 49152:
                break;
            default:
                return -28
        }
        FS.mknod(path, mode, dev);
        return 0
    },
    doReadlink: function(path, buf, bufsize) {
        if (bufsize <= 0) return -28;
        var ret = FS.readlink(path);
        var len = Math.min(bufsize, lengthBytesUTF8(ret));
        var endChar = HEAP8[buf + len];
        stringToUTF8(ret, buf, bufsize + 1);
        HEAP8[buf + len] = endChar;
        return len
    },
    doAccess: function(path, amode) {
        if (amode & ~7) {
            return -28
        }
        var node;
        var lookup = FS.lookupPath(path, {
            follow: true
        });
        node = lookup.node;
        if (!node) {
            return -44
        }
        var perms = "";
        if (amode & 4) perms += "r";
        if (amode & 2) perms += "w";
        if (amode & 1) perms += "x";
        if (perms && FS.nodePermissions(node, perms)) {
            return -2
        }
        return 0
    },
    doDup: function(path, flags, suggestFD) {
        var suggest = FS.getStream(suggestFD);
        if (suggest) FS.close(suggest);
        return FS.open(path, flags, 0, suggestFD, suggestFD).fd
    },
    doReadv: function(stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[iov + i * 8 >> 2];
            var len = HEAP32[iov + (i * 8 + 4) >> 2];
            var curr = FS.read(stream, HEAP8, ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr;
            if (curr < len) break
        }
        return ret
    },
    doWritev: function(stream, iov, iovcnt, offset) {
        var ret = 0;
        for (var i = 0; i < iovcnt; i++) {
            var ptr = HEAP32[iov + i * 8 >> 2];
            var len = HEAP32[iov + (i * 8 + 4) >> 2];
            var curr = FS.write(stream, HEAP8, ptr, len, offset);
            if (curr < 0) return -1;
            ret += curr
        }
        return ret
    },
    varargs: 0,
    get: function(varargs) {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
        return ret
    },
    getStr: function() {
        var ret = UTF8ToString(SYSCALLS.get());
        return ret
    },
    getStreamFromFD: function(fd) {
        if (fd === undefined) fd = SYSCALLS.get();
        var stream = FS.getStream(fd);
        if (!stream) throw new FS.ErrnoError(8);
        return stream
    },
    get64: function() {
        var low = SYSCALLS.get(),
            high = SYSCALLS.get();
        return low
    },
    getZero: function() {
        SYSCALLS.get()
    }
};

function ___syscall10(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr();
        FS.unlink(path);
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall125(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function __emscripten_syscall_mmap2(addr, len, prot, flags, fd, off) {
    off <<= 12;
    var ptr;
    var allocated = false;
    if ((flags & 16) !== 0 && addr % PAGE_SIZE !== 0) {
        return -28
    }
    if ((flags & 32) !== 0) {
        ptr = _memalign(PAGE_SIZE, len);
        if (!ptr) return -48;
        _memset(ptr, 0, len);
        allocated = true
    } else {
        var info = FS.getStream(fd);
        if (!info) return -8;
        var res = FS.mmap(info, HEAPU8, addr, len, off, prot, flags);
        ptr = res.ptr;
        allocated = res.allocated
    }
    SYSCALLS.mappings[ptr] = {
        malloc: ptr,
        len: len,
        allocated: allocated,
        fd: fd,
        flags: flags
    };
    return ptr
}

function ___syscall192(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var addr = SYSCALLS.get(),
            len = SYSCALLS.get(),
            prot = SYSCALLS.get(),
            flags = SYSCALLS.get(),
            fd = SYSCALLS.get(),
            off = SYSCALLS.get();
        return __emscripten_syscall_mmap2(addr, len, prot, flags, fd, off)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall194(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var fd = SYSCALLS.get(),
            zero = SYSCALLS.getZero(),
            length = SYSCALLS.get64();
        FS.ftruncate(fd, length);
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall195(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr(),
            buf = SYSCALLS.get();
        return SYSCALLS.doStat(FS.stat, path, buf)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall196(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr(),
            buf = SYSCALLS.get();
        return SYSCALLS.doStat(FS.lstat, path, buf)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall197(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(),
            buf = SYSCALLS.get();
        return SYSCALLS.doStat(FS.stat, stream.path, buf)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}
var PROCINFO = {
    ppid: 1,
    pid: 42,
    sid: 42,
    pgid: 42
};

function ___syscall20(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        return PROCINFO.pid
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall221(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(),
            cmd = SYSCALLS.get();
        switch (cmd) {
            case 0:
                {
                    var arg = SYSCALLS.get();
                    if (arg < 0) {
                        return -28
                    }
                    var newStream;
                    newStream = FS.open(stream.path, stream.flags, 0, arg);
                    return newStream.fd
                }
            case 1:
            case 2:
                return 0;
            case 3:
                return stream.flags;
            case 4:
                {
                    var arg = SYSCALLS.get();
                    stream.flags |= arg;
                    return 0
                }
            case 12:
                {
                    var arg = SYSCALLS.get();
                    var offset = 0;
                    HEAP16[arg + offset >> 1] = 2;
                    return 0
                }
            case 13:
            case 14:
                return 0;
            case 16:
            case 8:
                return -28;
            case 9:
                ___setErrNo(28);
                return -1;
            default:
                {
                    return -28
                }
        }
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall3(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(),
            buf = SYSCALLS.get(),
            count = SYSCALLS.get();
        return FS.read(stream, HEAP8, buf, count)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall330(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var old = SYSCALLS.getStreamFromFD(),
            suggestFD = SYSCALLS.get(),
            flags = SYSCALLS.get();
        if (old.fd === suggestFD) return -28;
        return SYSCALLS.doDup(old.path, old.flags, suggestFD)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall38(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var old_path = SYSCALLS.getStr(),
            new_path = SYSCALLS.getStr();
        FS.rename(old_path, new_path);
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall39(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr(),
            mode = SYSCALLS.get();
        return SYSCALLS.doMkdir(path, mode)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall4(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(),
            buf = SYSCALLS.get(),
            count = SYSCALLS.get();
        return FS.write(stream, HEAP8, buf, count)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall40(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var path = SYSCALLS.getStr();
        FS.rmdir(path);
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall5(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var pathname = SYSCALLS.getStr(),
            flags = SYSCALLS.get(),
            mode = SYSCALLS.get();
        var stream = FS.open(pathname, flags, mode);
        return stream.fd
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall54(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var stream = SYSCALLS.getStreamFromFD(),
            op = SYSCALLS.get();
        switch (op) {
            case 21509:
            case 21505:
                {
                    if (!stream.tty) return -59;
                    return 0
                }
            case 21510:
            case 21511:
            case 21512:
            case 21506:
            case 21507:
            case 21508:
                {
                    if (!stream.tty) return -59;
                    return 0
                }
            case 21519:
                {
                    if (!stream.tty) return -59;
                    var argp = SYSCALLS.get();
                    HEAP32[argp >> 2] = 0;
                    return 0
                }
            case 21520:
                {
                    if (!stream.tty) return -59;
                    return -28
                }
            case 21531:
                {
                    var argp = SYSCALLS.get();
                    return FS.ioctl(stream, op, argp)
                }
            case 21523:
                {
                    if (!stream.tty) return -59;
                    return 0
                }
            case 21524:
                {
                    if (!stream.tty) return -59;
                    return 0
                }
            default:
                abort("bad ioctl syscall " + op)
        }
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___syscall63(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var old = SYSCALLS.getStreamFromFD(),
            suggestFD = SYSCALLS.get();
        if (old.fd === suggestFD) return suggestFD;
        return SYSCALLS.doDup(old.path, old.flags, suggestFD)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function __emscripten_syscall_munmap(addr, len) {
    if (addr === -1 || len === 0) {
        return -28
    }
    var info = SYSCALLS.mappings[addr];
    if (!info) return 0;
    if (len === info.len) {
        var stream = FS.getStream(info.fd);
        SYSCALLS.doMsync(addr, stream, len, info.flags);
        FS.munmap(stream);
        SYSCALLS.mappings[addr] = null;
        if (info.allocated) {
            _free(info.malloc)
        }
    }
    return 0
}

function ___syscall91(which, varargs) {
    SYSCALLS.varargs = varargs;
    try {
        var addr = SYSCALLS.get(),
            len = SYSCALLS.get();
        return __emscripten_syscall_munmap(addr, len)
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return -e.errno
    }
}

function ___unlock() {}

function _fd_close(fd) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        FS.close(stream);
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return e.errno
    }
}

function ___wasi_fd_close() {
    return _fd_close.apply(null, arguments)
}

function _fd_fdstat_get(fd, pbuf) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var type = stream.tty ? 2 : FS.isDir(stream.mode) ? 3 : FS.isLink(stream.mode) ? 7 : 4;
        HEAP8[pbuf >> 0] = type;
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return e.errno
    }
}

function ___wasi_fd_fdstat_get() {
    return _fd_fdstat_get.apply(null, arguments)
}

function _fd_read(fd, iov, iovcnt, pnum) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var num = SYSCALLS.doReadv(stream, iov, iovcnt);
        HEAP32[pnum >> 2] = num;
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return e.errno
    }
}

function ___wasi_fd_read() {
    return _fd_read.apply(null, arguments)
}

function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var HIGH_OFFSET = 4294967296;
        var offset = offset_high * HIGH_OFFSET + (offset_low >>> 0);
        var DOUBLE_LIMIT = 9007199254740992;
        if (offset <= -DOUBLE_LIMIT || offset >= DOUBLE_LIMIT) {
            return -61
        }
        FS.llseek(stream, offset, whence);
        tempI64 = [stream.position >>> 0, (tempDouble = stream.position, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[newOffset >> 2] = tempI64[0], HEAP32[newOffset + 4 >> 2] = tempI64[1];
        if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null;
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return e.errno
    }
}

function ___wasi_fd_seek() {
    return _fd_seek.apply(null, arguments)
}

function _fd_sync(fd) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        if (stream.stream_ops && stream.stream_ops.fsync) {
            return -stream.stream_ops.fsync(stream)
        }
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return e.errno
    }
}

function ___wasi_fd_sync() {
    return _fd_sync.apply(null, arguments)
}

function _fd_write(fd, iov, iovcnt, pnum) {
    try {
        var stream = SYSCALLS.getStreamFromFD(fd);
        var num = SYSCALLS.doWritev(stream, iov, iovcnt);
        HEAP32[pnum >> 2] = num;
        return 0
    } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError)) abort(e);
        return e.errno
    }
}

function ___wasi_fd_write() {
    return _fd_write.apply(null, arguments)
}

function getShiftFromSize(size) {
    switch (size) {
        case 1:
            return 0;
        case 2:
            return 1;
        case 4:
            return 2;
        case 8:
            return 3;
        default:
            throw new TypeError("Unknown type size: " + size)
    }
}

function embind_init_charCodes() {
    var codes = new Array(256);
    for (var i = 0; i < 256; ++i) {
        codes[i] = String.fromCharCode(i)
    }
    embind_charCodes = codes
}
var embind_charCodes = undefined;

function readLatin1String(ptr) {
    var ret = "";
    var c = ptr;
    while (HEAPU8[c]) {
        ret += embind_charCodes[HEAPU8[c++]]
    }
    return ret
}
var awaitingDependencies = {};
var registeredTypes = {};
var typeDependencies = {};
var char_0 = 48;
var char_9 = 57;

function makeLegalFunctionName(name) {
    if (undefined === name) {
        return "_unknown"
    }
    name = name.replace(/[^a-zA-Z0-9_]/g, "$");
    var f = name.charCodeAt(0);
    if (f >= char_0 && f <= char_9) {
        return "_" + name
    } else {
        return name
    }
}

function createNamedFunction(name, body) {
    name = makeLegalFunctionName(name);
    return new Function("body", "return function " + name + "() {\n" + '    "use strict";' + "    return body.apply(this, arguments);\n" + "};\n")(body)
}

function extendError(baseErrorType, errorName) {
    var errorClass = createNamedFunction(errorName, function(message) {
        this.name = errorName;
        this.message = message;
        var stack = new Error(message).stack;
        if (stack !== undefined) {
            this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "")
        }
    });
    errorClass.prototype = Object.create(baseErrorType.prototype);
    errorClass.prototype.constructor = errorClass;
    errorClass.prototype.toString = function() {
        if (this.message === undefined) {
            return this.name
        } else {
            return this.name + ": " + this.message
        }
    };
    return errorClass
}
var BindingError = undefined;

function throwBindingError(message) {
    throw new BindingError(message)
}
var InternalError = undefined;

function throwInternalError(message) {
    throw new InternalError(message)
}

function whenDependentTypesAreResolved(myTypes, dependentTypes, getTypeConverters) {
    myTypes.forEach(function(type) {
        typeDependencies[type] = dependentTypes
    });

    function onComplete(typeConverters) {
        var myTypeConverters = getTypeConverters(typeConverters);
        if (myTypeConverters.length !== myTypes.length) {
            throwInternalError("Mismatched type converter count")
        }
        for (var i = 0; i < myTypes.length; ++i) {
            registerType(myTypes[i], myTypeConverters[i])
        }
    }
    var typeConverters = new Array(dependentTypes.length);
    var unregisteredTypes = [];
    var registered = 0;
    dependentTypes.forEach(function(dt, i) {
        if (registeredTypes.hasOwnProperty(dt)) {
            typeConverters[i] = registeredTypes[dt]
        } else {
            unregisteredTypes.push(dt);
            if (!awaitingDependencies.hasOwnProperty(dt)) {
                awaitingDependencies[dt] = []
            }
            awaitingDependencies[dt].push(function() {
                typeConverters[i] = registeredTypes[dt];
                ++registered;
                if (registered === unregisteredTypes.length) {
                    onComplete(typeConverters)
                }
            })
        }
    });
    if (0 === unregisteredTypes.length) {
        onComplete(typeConverters)
    }
}

function registerType(rawType, registeredInstance, options) {
    options = options || {};
    if (!("argPackAdvance" in registeredInstance)) {
        throw new TypeError("registerType registeredInstance requires argPackAdvance")
    }
    var name = registeredInstance.name;
    if (!rawType) {
        throwBindingError('type "' + name + '" must have a positive integer typeid pointer')
    }
    if (registeredTypes.hasOwnProperty(rawType)) {
        if (options.ignoreDuplicateRegistrations) {
            return
        } else {
            throwBindingError("Cannot register type '" + name + "' twice")
        }
    }
    registeredTypes[rawType] = registeredInstance;
    delete typeDependencies[rawType];
    if (awaitingDependencies.hasOwnProperty(rawType)) {
        var callbacks = awaitingDependencies[rawType];
        delete awaitingDependencies[rawType];
        callbacks.forEach(function(cb) {
            cb()
        })
    }
}

function __embind_register_bool(rawType, name, size, trueValue, falseValue) {
    var shift = getShiftFromSize(size);
    name = readLatin1String(name);
    registerType(rawType, {
        name: name,
        "fromWireType": function(wt) {
            return !!wt
        },
        "toWireType": function(destructors, o) {
            return o ? trueValue : falseValue
        },
        "argPackAdvance": 8,
        "readValueFromPointer": function(pointer) {
            var heap;
            if (size === 1) {
                heap = HEAP8
            } else if (size === 2) {
                heap = HEAP16
            } else if (size === 4) {
                heap = HEAP32
            } else {
                throw new TypeError("Unknown boolean type size: " + name)
            }
            return this["fromWireType"](heap[pointer >> shift])
        },
        destructorFunction: null
    })
}

function ClassHandle_isAliasOf(other) {
    if (!(this instanceof ClassHandle)) {
        return false
    }
    if (!(other instanceof ClassHandle)) {
        return false
    }
    var leftClass = this.$$.ptrType.registeredClass;
    var left = this.$$.ptr;
    var rightClass = other.$$.ptrType.registeredClass;
    var right = other.$$.ptr;
    while (leftClass.baseClass) {
        left = leftClass.upcast(left);
        leftClass = leftClass.baseClass
    }
    while (rightClass.baseClass) {
        right = rightClass.upcast(right);
        rightClass = rightClass.baseClass
    }
    return leftClass === rightClass && left === right
}

function shallowCopyInternalPointer(o) {
    return {
        count: o.count,
        deleteScheduled: o.deleteScheduled,
        preservePointerOnDelete: o.preservePointerOnDelete,
        ptr: o.ptr,
        ptrType: o.ptrType,
        smartPtr: o.smartPtr,
        smartPtrType: o.smartPtrType
    }
}

function throwInstanceAlreadyDeleted(obj) {
    function getInstanceTypeName(handle) {
        return handle.$$.ptrType.registeredClass.name
    }
    throwBindingError(getInstanceTypeName(obj) + " instance already deleted")
}
var finalizationGroup = false;

function detachFinalizer(handle) {}

function runDestructor($$) {
    if ($$.smartPtr) {
        $$.smartPtrType.rawDestructor($$.smartPtr)
    } else {
        $$.ptrType.registeredClass.rawDestructor($$.ptr)
    }
}

function releaseClassHandle($$) {
    $$.count.value -= 1;
    var toDelete = 0 === $$.count.value;
    if (toDelete) {
        runDestructor($$)
    }
}

function attachFinalizer(handle) {
    if ("undefined" === typeof FinalizationGroup) {
        attachFinalizer = function(handle) {
            return handle
        };
        return handle
    }
    finalizationGroup = new FinalizationGroup(function(iter) {
        for (var result = iter.next(); !result.done; result = iter.next()) {
            var $$ = result.value;
            if (!$$.ptr) {
                console.warn("object already deleted: " + $$.ptr)
            } else {
                releaseClassHandle($$)
            }
        }
    });
    attachFinalizer = function(handle) {
        finalizationGroup.register(handle, handle.$$, handle.$$);
        return handle
    };
    detachFinalizer = function(handle) {
        finalizationGroup.unregister(handle.$$)
    };
    return attachFinalizer(handle)
}

function ClassHandle_clone() {
    if (!this.$$.ptr) {
        throwInstanceAlreadyDeleted(this)
    }
    if (this.$$.preservePointerOnDelete) {
        this.$$.count.value += 1;
        return this
    } else {
        var clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), {
            $$: {
                value: shallowCopyInternalPointer(this.$$)
            }
        }));
        clone.$$.count.value += 1;
        clone.$$.deleteScheduled = false;
        return clone
    }
}

function ClassHandle_delete() {
    if (!this.$$.ptr) {
        throwInstanceAlreadyDeleted(this)
    }
    if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
        throwBindingError("Object already scheduled for deletion")
    }
    detachFinalizer(this);
    releaseClassHandle(this.$$);
    if (!this.$$.preservePointerOnDelete) {
        this.$$.smartPtr = undefined;
        this.$$.ptr = undefined
    }
}

function ClassHandle_isDeleted() {
    return !this.$$.ptr
}
var delayFunction = undefined;
var deletionQueue = [];

function flushPendingDeletes() {
    while (deletionQueue.length) {
        var obj = deletionQueue.pop();
        obj.$$.deleteScheduled = false;
        obj["delete"]()
    }
}

function ClassHandle_deleteLater() {
    if (!this.$$.ptr) {
        throwInstanceAlreadyDeleted(this)
    }
    if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
        throwBindingError("Object already scheduled for deletion")
    }
    deletionQueue.push(this);
    if (deletionQueue.length === 1 && delayFunction) {
        delayFunction(flushPendingDeletes)
    }
    this.$$.deleteScheduled = true;
    return this
}

function init_ClassHandle() {
    ClassHandle.prototype["isAliasOf"] = ClassHandle_isAliasOf;
    ClassHandle.prototype["clone"] = ClassHandle_clone;
    ClassHandle.prototype["delete"] = ClassHandle_delete;
    ClassHandle.prototype["isDeleted"] = ClassHandle_isDeleted;
    ClassHandle.prototype["deleteLater"] = ClassHandle_deleteLater
}

function ClassHandle() {}
var registeredPointers = {};

function ensureOverloadTable(proto, methodName, humanName) {
    if (undefined === proto[methodName].overloadTable) {
        var prevFunc = proto[methodName];
        proto[methodName] = function() {
            if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) {
                throwBindingError("Function '" + humanName + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + proto[methodName].overloadTable + ")!")
            }
            return proto[methodName].overloadTable[arguments.length].apply(this, arguments)
        };
        proto[methodName].overloadTable = [];
        proto[methodName].overloadTable[prevFunc.argCount] = prevFunc
    }
}

function exposePublicSymbol(name, value, numArguments) {
    if (Module.hasOwnProperty(name)) {
        if (undefined === numArguments || undefined !== Module[name].overloadTable && undefined !== Module[name].overloadTable[numArguments]) {
            throwBindingError("Cannot register public name '" + name + "' twice")
        }
        ensureOverloadTable(Module, name, name);
        if (Module.hasOwnProperty(numArguments)) {
            throwBindingError("Cannot register multiple overloads of a function with the same number of arguments (" + numArguments + ")!")
        }
        Module[name].overloadTable[numArguments] = value
    } else {
        Module[name] = value;
        if (undefined !== numArguments) {
            Module[name].numArguments = numArguments
        }
    }
}

function RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast) {
    this.name = name;
    this.constructor = constructor;
    this.instancePrototype = instancePrototype;
    this.rawDestructor = rawDestructor;
    this.baseClass = baseClass;
    this.getActualType = getActualType;
    this.upcast = upcast;
    this.downcast = downcast;
    this.pureVirtualFunctions = []
}

function upcastPointer(ptr, ptrClass, desiredClass) {
    while (ptrClass !== desiredClass) {
        if (!ptrClass.upcast) {
            throwBindingError("Expected null or instance of " + desiredClass.name + ", got an instance of " + ptrClass.name)
        }
        ptr = ptrClass.upcast(ptr);
        ptrClass = ptrClass.baseClass
    }
    return ptr
}

function constNoSmartPtrRawPointerToWireType(destructors, handle) {
    if (handle === null) {
        if (this.isReference) {
            throwBindingError("null is not a valid " + this.name)
        }
        return 0
    }
    if (!handle.$$) {
        throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name)
    }
    if (!handle.$$.ptr) {
        throwBindingError("Cannot pass deleted object as a pointer of type " + this.name)
    }
    var handleClass = handle.$$.ptrType.registeredClass;
    var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
    return ptr
}

function genericPointerToWireType(destructors, handle) {
    var ptr;
    if (handle === null) {
        if (this.isReference) {
            throwBindingError("null is not a valid " + this.name)
        }
        if (this.isSmartPointer) {
            ptr = this.rawConstructor();
            if (destructors !== null) {
                destructors.push(this.rawDestructor, ptr)
            }
            return ptr
        } else {
            return 0
        }
    }
    if (!handle.$$) {
        throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name)
    }
    if (!handle.$$.ptr) {
        throwBindingError("Cannot pass deleted object as a pointer of type " + this.name)
    }
    if (!this.isConst && handle.$$.ptrType.isConst) {
        throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name)
    }
    var handleClass = handle.$$.ptrType.registeredClass;
    ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
    if (this.isSmartPointer) {
        if (undefined === handle.$$.smartPtr) {
            throwBindingError("Passing raw pointer to smart pointer is illegal")
        }
        switch (this.sharingPolicy) {
            case 0:
                if (handle.$$.smartPtrType === this) {
                    ptr = handle.$$.smartPtr
                } else {
                    throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name)
                }
                break;
            case 1:
                ptr = handle.$$.smartPtr;
                break;
            case 2:
                if (handle.$$.smartPtrType === this) {
                    ptr = handle.$$.smartPtr
                } else {
                    var clonedHandle = handle["clone"]();
                    ptr = this.rawShare(ptr, __emval_register(function() {
                        clonedHandle["delete"]()
                    }));
                    if (destructors !== null) {
                        destructors.push(this.rawDestructor, ptr)
                    }
                }
                break;
            default:
                throwBindingError("Unsupporting sharing policy")
        }
    }
    return ptr
}

function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
    if (handle === null) {
        if (this.isReference) {
            throwBindingError("null is not a valid " + this.name)
        }
        return 0
    }
    if (!handle.$$) {
        throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name)
    }
    if (!handle.$$.ptr) {
        throwBindingError("Cannot pass deleted object as a pointer of type " + this.name)
    }
    if (handle.$$.ptrType.isConst) {
        throwBindingError("Cannot convert argument of type " + handle.$$.ptrType.name + " to parameter type " + this.name)
    }
    var handleClass = handle.$$.ptrType.registeredClass;
    var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
    return ptr
}

function simpleReadValueFromPointer(pointer) {
    return this["fromWireType"](HEAPU32[pointer >> 2])
}

function RegisteredPointer_getPointee(ptr) {
    if (this.rawGetPointee) {
        ptr = this.rawGetPointee(ptr)
    }
    return ptr
}

function RegisteredPointer_destructor(ptr) {
    if (this.rawDestructor) {
        this.rawDestructor(ptr)
    }
}

function RegisteredPointer_deleteObject(handle) {
    if (handle !== null) {
        handle["delete"]()
    }
}

function downcastPointer(ptr, ptrClass, desiredClass) {
    if (ptrClass === desiredClass) {
        return ptr
    }
    if (undefined === desiredClass.baseClass) {
        return null
    }
    var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);
    if (rv === null) {
        return null
    }
    return desiredClass.downcast(rv)
}

function getInheritedInstanceCount() {
    return Object.keys(registeredInstances).length
}

function getLiveInheritedInstances() {
    var rv = [];
    for (var k in registeredInstances) {
        if (registeredInstances.hasOwnProperty(k)) {
            rv.push(registeredInstances[k])
        }
    }
    return rv
}

function setDelayFunction(fn) {
    delayFunction = fn;
    if (deletionQueue.length && delayFunction) {
        delayFunction(flushPendingDeletes)
    }
}

function init_embind() {
    Module["getInheritedInstanceCount"] = getInheritedInstanceCount;
    Module["getLiveInheritedInstances"] = getLiveInheritedInstances;
    Module["flushPendingDeletes"] = flushPendingDeletes;
    Module["setDelayFunction"] = setDelayFunction
}
var registeredInstances = {};

function getBasestPointer(class_, ptr) {
    if (ptr === undefined) {
        throwBindingError("ptr should not be undefined")
    }
    while (class_.baseClass) {
        ptr = class_.upcast(ptr);
        class_ = class_.baseClass
    }
    return ptr
}

function getInheritedInstance(class_, ptr) {
    ptr = getBasestPointer(class_, ptr);
    return registeredInstances[ptr]
}

function makeClassHandle(prototype, record) {
    if (!record.ptrType || !record.ptr) {
        throwInternalError("makeClassHandle requires ptr and ptrType")
    }
    var hasSmartPtrType = !!record.smartPtrType;
    var hasSmartPtr = !!record.smartPtr;
    if (hasSmartPtrType !== hasSmartPtr) {
        throwInternalError("Both smartPtrType and smartPtr must be specified")
    }
    record.count = {
        value: 1
    };
    return attachFinalizer(Object.create(prototype, {
        $$: {
            value: record
        }
    }))
}

function RegisteredPointer_fromWireType(ptr) {
    var rawPointer = this.getPointee(ptr);
    if (!rawPointer) {
        this.destructor(ptr);
        return null
    }
    var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);
    if (undefined !== registeredInstance) {
        if (0 === registeredInstance.$$.count.value) {
            registeredInstance.$$.ptr = rawPointer;
            registeredInstance.$$.smartPtr = ptr;
            return registeredInstance["clone"]()
        } else {
            var rv = registeredInstance["clone"]();
            this.destructor(ptr);
            return rv
        }
    }

    function makeDefaultHandle() {
        if (this.isSmartPointer) {
            return makeClassHandle(this.registeredClass.instancePrototype, {
                ptrType: this.pointeeType,
                ptr: rawPointer,
                smartPtrType: this,
                smartPtr: ptr
            })
        } else {
            return makeClassHandle(this.registeredClass.instancePrototype, {
                ptrType: this,
                ptr: ptr
            })
        }
    }
    var actualType = this.registeredClass.getActualType(rawPointer);
    var registeredPointerRecord = registeredPointers[actualType];
    if (!registeredPointerRecord) {
        return makeDefaultHandle.call(this)
    }
    var toType;
    if (this.isConst) {
        toType = registeredPointerRecord.constPointerType
    } else {
        toType = registeredPointerRecord.pointerType
    }
    var dp = downcastPointer(rawPointer, this.registeredClass, toType.registeredClass);
    if (dp === null) {
        return makeDefaultHandle.call(this)
    }
    if (this.isSmartPointer) {
        return makeClassHandle(toType.registeredClass.instancePrototype, {
            ptrType: toType,
            ptr: dp,
            smartPtrType: this,
            smartPtr: ptr
        })
    } else {
        return makeClassHandle(toType.registeredClass.instancePrototype, {
            ptrType: toType,
            ptr: dp
        })
    }
}

function init_RegisteredPointer() {
    RegisteredPointer.prototype.getPointee = RegisteredPointer_getPointee;
    RegisteredPointer.prototype.destructor = RegisteredPointer_destructor;
    RegisteredPointer.prototype["argPackAdvance"] = 8;
    RegisteredPointer.prototype["readValueFromPointer"] = simpleReadValueFromPointer;
    RegisteredPointer.prototype["deleteObject"] = RegisteredPointer_deleteObject;
    RegisteredPointer.prototype["fromWireType"] = RegisteredPointer_fromWireType
}

function RegisteredPointer(name, registeredClass, isReference, isConst, isSmartPointer, pointeeType, sharingPolicy, rawGetPointee, rawConstructor, rawShare, rawDestructor) {
    this.name = name;
    this.registeredClass = registeredClass;
    this.isReference = isReference;
    this.isConst = isConst;
    this.isSmartPointer = isSmartPointer;
    this.pointeeType = pointeeType;
    this.sharingPolicy = sharingPolicy;
    this.rawGetPointee = rawGetPointee;
    this.rawConstructor = rawConstructor;
    this.rawShare = rawShare;
    this.rawDestructor = rawDestructor;
    if (!isSmartPointer && registeredClass.baseClass === undefined) {
        if (isConst) {
            this["toWireType"] = constNoSmartPtrRawPointerToWireType;
            this.destructorFunction = null
        } else {
            this["toWireType"] = nonConstNoSmartPtrRawPointerToWireType;
            this.destructorFunction = null
        }
    } else {
        this["toWireType"] = genericPointerToWireType
    }
}

function replacePublicSymbol(name, value, numArguments) {
    if (!Module.hasOwnProperty(name)) {
        throwInternalError("Replacing nonexistant public symbol")
    }
    if (undefined !== Module[name].overloadTable && undefined !== numArguments) {
        Module[name].overloadTable[numArguments] = value
    } else {
        Module[name] = value;
        Module[name].argCount = numArguments
    }
}

function embind__requireFunction(signature, rawFunction) {
    signature = readLatin1String(signature);

    function makeDynCaller(dynCall) {
        var args = [];
        for (var i = 1; i < signature.length; ++i) {
            args.push("a" + i)
        }
        var name = "dynCall_" + signature + "_" + rawFunction;
        var body = "return function " + name + "(" + args.join(", ") + ") {\n";
        body += "    return dynCall(rawFunction" + (args.length ? ", " : "") + args.join(", ") + ");\n";
        body += "};\n";
        return new Function("dynCall", "rawFunction", body)(dynCall, rawFunction)
    }
    var fp;
    if (Module["FUNCTION_TABLE_" + signature] !== undefined) {
        fp = Module["FUNCTION_TABLE_" + signature][rawFunction]
    } else if (typeof FUNCTION_TABLE !== "undefined") {
        fp = FUNCTION_TABLE[rawFunction]
    } else {
        var dc = Module["dynCall_" + signature];
        if (dc === undefined) {
            dc = Module["dynCall_" + signature.replace(/f/g, "d")];
            if (dc === undefined) {
                throwBindingError("No dynCall invoker for signature: " + signature)
            }
        }
        fp = makeDynCaller(dc)
    }
    if (typeof fp !== "function") {
        throwBindingError("unknown function pointer with signature " + signature + ": " + rawFunction)
    }
    return fp
}
var UnboundTypeError = undefined;

function getTypeName(type) {
    var ptr = ___getTypeName(type);
    var rv = readLatin1String(ptr);
    _free(ptr);
    return rv
}

function throwUnboundTypeError(message, types) {
    var unboundTypes = [];
    var seen = {};

    function visit(type) {
        if (seen[type]) {
            return
        }
        if (registeredTypes[type]) {
            return
        }
        if (typeDependencies[type]) {
            typeDependencies[type].forEach(visit);
            return
        }
        unboundTypes.push(type);
        seen[type] = true
    }
    types.forEach(visit);
    throw new UnboundTypeError(message + ": " + unboundTypes.map(getTypeName).join([", "]))
}

function __embind_register_class(rawType, rawPointerType, rawConstPointerType, baseClassRawType, getActualTypeSignature, getActualType, upcastSignature, upcast, downcastSignature, downcast, name, destructorSignature, rawDestructor) {
    name = readLatin1String(name);
    getActualType = embind__requireFunction(getActualTypeSignature, getActualType);
    if (upcast) {
        upcast = embind__requireFunction(upcastSignature, upcast)
    }
    if (downcast) {
        downcast = embind__requireFunction(downcastSignature, downcast)
    }
    rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
    var legalFunctionName = makeLegalFunctionName(name);
    exposePublicSymbol(legalFunctionName, function() {
        throwUnboundTypeError("Cannot construct " + name + " due to unbound types", [baseClassRawType])
    });
    whenDependentTypesAreResolved([rawType, rawPointerType, rawConstPointerType], baseClassRawType ? [baseClassRawType] : [], function(base) {
        base = base[0];
        var baseClass;
        var basePrototype;
        if (baseClassRawType) {
            baseClass = base.registeredClass;
            basePrototype = baseClass.instancePrototype
        } else {
            basePrototype = ClassHandle.prototype
        }
        var constructor = createNamedFunction(legalFunctionName, function() {
            if (Object.getPrototypeOf(this) !== instancePrototype) {
                throw new BindingError("Use 'new' to construct " + name)
            }
            if (undefined === registeredClass.constructor_body) {
                throw new BindingError(name + " has no accessible constructor")
            }
            var body = registeredClass.constructor_body[arguments.length];
            if (undefined === body) {
                throw new BindingError("Tried to invoke ctor of " + name + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(registeredClass.constructor_body).toString() + ") parameters instead!")
            }
            return body.apply(this, arguments)
        });
        var instancePrototype = Object.create(basePrototype, {
            constructor: {
                value: constructor
            }
        });
        constructor.prototype = instancePrototype;
        var registeredClass = new RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast);
        var referenceConverter = new RegisteredPointer(name, registeredClass, true, false, false);
        var pointerConverter = new RegisteredPointer(name + "*", registeredClass, false, false, false);
        var constPointerConverter = new RegisteredPointer(name + " const*", registeredClass, false, true, false);
        registeredPointers[rawType] = {
            pointerType: pointerConverter,
            constPointerType: constPointerConverter
        };
        replacePublicSymbol(legalFunctionName, constructor);
        return [referenceConverter, pointerConverter, constPointerConverter]
    })
}
var emval_free_list = [];
var emval_handle_array = [{}, {
    value: undefined
}, {
    value: null
}, {
    value: true
}, {
    value: false
}];

function __emval_decref(handle) {
    if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
        emval_handle_array[handle] = undefined;
        emval_free_list.push(handle)
    }
}

function count_emval_handles() {
    var count = 0;
    for (var i = 5; i < emval_handle_array.length; ++i) {
        if (emval_handle_array[i] !== undefined) {
            ++count
        }
    }
    return count
}

function get_first_emval() {
    for (var i = 5; i < emval_handle_array.length; ++i) {
        if (emval_handle_array[i] !== undefined) {
            return emval_handle_array[i]
        }
    }
    return null
}

function init_emval() {
    Module["count_emval_handles"] = count_emval_handles;
    Module["get_first_emval"] = get_first_emval
}

function __emval_register(value) {
    switch (value) {
        case undefined:
            {
                return 1
            }
        case null:
            {
                return 2
            }
        case true:
            {
                return 3
            }
        case false:
            {
                return 4
            }
        default:
            {
                var handle = emval_free_list.length ? emval_free_list.pop() : emval_handle_array.length;
                emval_handle_array[handle] = {
                    refcount: 1,
                    value: value
                };
                return handle
            }
    }
}

function __embind_register_emval(rawType, name) {
    name = readLatin1String(name);
    registerType(rawType, {
        name: name,
        "fromWireType": function(handle) {
            var rv = emval_handle_array[handle].value;
            __emval_decref(handle);
            return rv
        },
        "toWireType": function(destructors, value) {
            return __emval_register(value)
        },
        "argPackAdvance": 8,
        "readValueFromPointer": simpleReadValueFromPointer,
        destructorFunction: null
    })
}

function enumReadValueFromPointer(name, shift, signed) {
    switch (shift) {
        case 0:
            return function(pointer) {
                var heap = signed ? HEAP8 : HEAPU8;
                return this["fromWireType"](heap[pointer])
            };
        case 1:
            return function(pointer) {
                var heap = signed ? HEAP16 : HEAPU16;
                return this["fromWireType"](heap[pointer >> 1])
            };
        case 2:
            return function(pointer) {
                var heap = signed ? HEAP32 : HEAPU32;
                return this["fromWireType"](heap[pointer >> 2])
            };
        default:
            throw new TypeError("Unknown integer type: " + name)
    }
}

function __embind_register_enum(rawType, name, size, isSigned) {
    var shift = getShiftFromSize(size);
    name = readLatin1String(name);

    function ctor() {}
    ctor.values = {};
    registerType(rawType, {
        name: name,
        constructor: ctor,
        "fromWireType": function(c) {
            return this.constructor.values[c]
        },
        "toWireType": function(destructors, c) {
            return c.value
        },
        "argPackAdvance": 8,
        "readValueFromPointer": enumReadValueFromPointer(name, shift, isSigned),
        destructorFunction: null
    });
    exposePublicSymbol(name, ctor)
}

function requireRegisteredType(rawType, humanName) {
    var impl = registeredTypes[rawType];
    if (undefined === impl) {
        throwBindingError(humanName + " has unknown type " + getTypeName(rawType))
    }
    return impl
}

function __embind_register_enum_value(rawEnumType, name, enumValue) {
    var enumType = requireRegisteredType(rawEnumType, "enum");
    name = readLatin1String(name);
    var Enum = enumType.constructor;
    var Value = Object.create(enumType.constructor.prototype, {
        value: {
            value: enumValue
        },
        constructor: {
            value: createNamedFunction(enumType.name + "_" + name, function() {})
        }
    });
    Enum.values[enumValue] = Value;
    Enum[name] = Value
}

function _embind_repr(v) {
    if (v === null) {
        return "null"
    }
    var t = typeof v;
    if (t === "object" || t === "array" || t === "function") {
        return v.toString()
    } else {
        return "" + v
    }
}

function floatReadValueFromPointer(name, shift) {
    switch (shift) {
        case 2:
            return function(pointer) {
                return this["fromWireType"](HEAPF32[pointer >> 2])
            };
        case 3:
            return function(pointer) {
                return this["fromWireType"](HEAPF64[pointer >> 3])
            };
        default:
            throw new TypeError("Unknown float type: " + name)
    }
}

function __embind_register_float(rawType, name, size) {
    var shift = getShiftFromSize(size);
    name = readLatin1String(name);
    registerType(rawType, {
        name: name,
        "fromWireType": function(value) {
            return value
        },
        "toWireType": function(destructors, value) {
            if (typeof value !== "number" && typeof value !== "boolean") {
                throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name)
            }
            return value
        },
        "argPackAdvance": 8,
        "readValueFromPointer": floatReadValueFromPointer(name, shift),
        destructorFunction: null
    })
}

function new_(constructor, argumentList) {
    if (!(constructor instanceof Function)) {
        throw new TypeError("new_ called with constructor type " + typeof constructor + " which is not a function")
    }
    var dummy = createNamedFunction(constructor.name || "unknownFunctionName", function() {});
    dummy.prototype = constructor.prototype;
    var obj = new dummy;
    var r = constructor.apply(obj, argumentList);
    return r instanceof Object ? r : obj
}

function runDestructors(destructors) {
    while (destructors.length) {
        var ptr = destructors.pop();
        var del = destructors.pop();
        del(ptr)
    }
}

function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc) {
    var argCount = argTypes.length;
    if (argCount < 2) {
        throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!")
    }
    var isClassMethodFunc = argTypes[1] !== null && classType !== null;
    var needsDestructorStack = false;
    for (var i = 1; i < argTypes.length; ++i) {
        if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) {
            needsDestructorStack = true;
            break
        }
    }
    var returns = argTypes[0].name !== "void";
    var argsList = "";
    var argsListWired = "";
    for (var i = 0; i < argCount - 2; ++i) {
        argsList += (i !== 0 ? ", " : "") + "arg" + i;
        argsListWired += (i !== 0 ? ", " : "") + "arg" + i + "Wired"
    }
    var invokerFnBody = "return function " + makeLegalFunctionName(humanName) + "(" + argsList + ") {\n" + "if (arguments.length !== " + (argCount - 2) + ") {\n" + "throwBindingError('function " + humanName + " called with ' + arguments.length + ' arguments, expected " + (argCount - 2) + " args!');\n" + "}\n";
    if (needsDestructorStack) {
        invokerFnBody += "var destructors = [];\n"
    }
    var dtorStack = needsDestructorStack ? "destructors" : "null";
    var args1 = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"];
    var args2 = [throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, argTypes[0], argTypes[1]];
    if (isClassMethodFunc) {
        invokerFnBody += "var thisWired = classParam.toWireType(" + dtorStack + ", this);\n"
    }
    for (var i = 0; i < argCount - 2; ++i) {
        invokerFnBody += "var arg" + i + "Wired = argType" + i + ".toWireType(" + dtorStack + ", arg" + i + "); // " + argTypes[i + 2].name + "\n";
        args1.push("argType" + i);
        args2.push(argTypes[i + 2])
    }
    if (isClassMethodFunc) {
        argsListWired = "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired
    }
    invokerFnBody += (returns ? "var rv = " : "") + "invoker(fn" + (argsListWired.length > 0 ? ", " : "") + argsListWired + ");\n";
    if (needsDestructorStack) {
        invokerFnBody += "runDestructors(destructors);\n"
    } else {
        for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
            var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired";
            if (argTypes[i].destructorFunction !== null) {
                invokerFnBody += paramName + "_dtor(" + paramName + "); // " + argTypes[i].name + "\n";
                args1.push(paramName + "_dtor");
                args2.push(argTypes[i].destructorFunction)
            }
        }
    }
    if (returns) {
        invokerFnBody += "var ret = retType.fromWireType(rv);\n" + "return ret;\n"
    } else {}
    invokerFnBody += "}\n";
    args1.push(invokerFnBody);
    var invokerFunction = new_(Function, args1).apply(null, args2);
    return invokerFunction
}

function heap32VectorToArray(count, firstElement) {
    var array = [];
    for (var i = 0; i < count; i++) {
        array.push(HEAP32[(firstElement >> 2) + i])
    }
    return array
}

function __embind_register_function(name, argCount, rawArgTypesAddr, signature, rawInvoker, fn) {
    var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
    name = readLatin1String(name);
    rawInvoker = embind__requireFunction(signature, rawInvoker);
    exposePublicSymbol(name, function() {
        throwUnboundTypeError("Cannot call " + name + " due to unbound types", argTypes)
    }, argCount - 1);
    whenDependentTypesAreResolved([], argTypes, function(argTypes) {
        var invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1));
        replacePublicSymbol(name, craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn), argCount - 1);
        return []
    })
}

function integerReadValueFromPointer(name, shift, signed) {
    switch (shift) {
        case 0:
            return signed ? function readS8FromPointer(pointer) {
                return HEAP8[pointer]
            } : function readU8FromPointer(pointer) {
                return HEAPU8[pointer]
            };
        case 1:
            return signed ? function readS16FromPointer(pointer) {
                return HEAP16[pointer >> 1]
            } : function readU16FromPointer(pointer) {
                return HEAPU16[pointer >> 1]
            };
        case 2:
            return signed ? function readS32FromPointer(pointer) {
                return HEAP32[pointer >> 2]
            } : function readU32FromPointer(pointer) {
                return HEAPU32[pointer >> 2]
            };
        default:
            throw new TypeError("Unknown integer type: " + name)
    }
}

function __embind_register_integer(primitiveType, name, size, minRange, maxRange) {
    name = readLatin1String(name);
    if (maxRange === -1) {
        maxRange = 4294967295
    }
    var shift = getShiftFromSize(size);
    var fromWireType = function(value) {
        return value
    };
    if (minRange === 0) {
        var bitshift = 32 - 8 * size;
        fromWireType = function(value) {
            return value << bitshift >>> bitshift
        }
    }
    var isUnsignedType = name.indexOf("unsigned") != -1;
    registerType(primitiveType, {
        name: name,
        "fromWireType": fromWireType,
        "toWireType": function(destructors, value) {
            if (typeof value !== "number" && typeof value !== "boolean") {
                throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name)
            }
            if (value < minRange || value > maxRange) {
                throw new TypeError('Passing a number "' + _embind_repr(value) + '" from JS side to C/C++ side to an argument of type "' + name + '", which is outside the valid range [' + minRange + ", " + maxRange + "]!")
            }
            return isUnsignedType ? value >>> 0 : value | 0
        },
        "argPackAdvance": 8,
        "readValueFromPointer": integerReadValueFromPointer(name, shift, minRange !== 0),
        destructorFunction: null
    })
}

function __embind_register_memory_view(rawType, dataTypeIndex, name) {
    var typeMapping = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];
    var TA = typeMapping[dataTypeIndex];

    function decodeMemoryView(handle) {
        handle = handle >> 2;
        var heap = HEAPU32;
        var size = heap[handle];
        var data = heap[handle + 1];
        return new TA(heap["buffer"], data, size)
    }
    name = readLatin1String(name);
    registerType(rawType, {
        name: name,
        "fromWireType": decodeMemoryView,
        "argPackAdvance": 8,
        "readValueFromPointer": decodeMemoryView
    }, {
        ignoreDuplicateRegistrations: true
    })
}

function __embind_register_std_string(rawType, name) {
    name = readLatin1String(name);
    var stdStringIsUTF8 = name === "std::string";
    registerType(rawType, {
        name: name,
        "fromWireType": function(value) {
            var length = HEAPU32[value >> 2];
            var str;
            if (stdStringIsUTF8) {
                var endChar = HEAPU8[value + 4 + length];
                var endCharSwap = 0;
                if (endChar != 0) {
                    endCharSwap = endChar;
                    HEAPU8[value + 4 + length] = 0
                }
                var decodeStartPtr = value + 4;
                for (var i = 0; i <= length; ++i) {
                    var currentBytePtr = value + 4 + i;
                    if (HEAPU8[currentBytePtr] == 0) {
                        var stringSegment = UTF8ToString(decodeStartPtr);
                        if (str === undefined) str = stringSegment;
                        else {
                            str += String.fromCharCode(0);
                            str += stringSegment
                        }
                        decodeStartPtr = currentBytePtr + 1
                    }
                }
                if (endCharSwap != 0) HEAPU8[value + 4 + length] = endCharSwap
            } else {
                var a = new Array(length);
                for (var i = 0; i < length; ++i) {
                    a[i] = String.fromCharCode(HEAPU8[value + 4 + i])
                }
                str = a.join("")
            }
            _free(value);
            return str
        },
        "toWireType": function(destructors, value) {
            if (value instanceof ArrayBuffer) {
                value = new Uint8Array(value)
            }
            var getLength;
            var valueIsOfTypeString = typeof value === "string";
            if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
                throwBindingError("Cannot pass non-string to std::string")
            }
            if (stdStringIsUTF8 && valueIsOfTypeString) {
                getLength = function() {
                    return lengthBytesUTF8(value)
                }
            } else {
                getLength = function() {
                    return value.length
                }
            }
            var length = getLength();
            var ptr = _malloc(4 + length + 1);
            HEAPU32[ptr >> 2] = length;
            if (stdStringIsUTF8 && valueIsOfTypeString) {
                stringToUTF8(value, ptr + 4, length + 1)
            } else {
                if (valueIsOfTypeString) {
                    for (var i = 0; i < length; ++i) {
                        var charCode = value.charCodeAt(i);
                        if (charCode > 255) {
                            _free(ptr);
                            throwBindingError("String has UTF-16 code units that do not fit in 8 bits")
                        }
                        HEAPU8[ptr + 4 + i] = charCode
                    }
                } else {
                    for (var i = 0; i < length; ++i) {
                        HEAPU8[ptr + 4 + i] = value[i]
                    }
                }
            }
            if (destructors !== null) {
                destructors.push(_free, ptr)
            }
            return ptr
        },
        "argPackAdvance": 8,
        "readValueFromPointer": simpleReadValueFromPointer,
        destructorFunction: function(ptr) {
            _free(ptr)
        }
    })
}

function __embind_register_std_wstring(rawType, charSize, name) {
    name = readLatin1String(name);
    var getHeap, shift;
    if (charSize === 2) {
        getHeap = function() {
            return HEAPU16
        };
        shift = 1
    } else if (charSize === 4) {
        getHeap = function() {
            return HEAPU32
        };
        shift = 2
    }
    registerType(rawType, {
        name: name,
        "fromWireType": function(value) {
            var HEAP = getHeap();
            var length = HEAPU32[value >> 2];
            var a = new Array(length);
            var start = value + 4 >> shift;
            for (var i = 0; i < length; ++i) {
                a[i] = String.fromCharCode(HEAP[start + i])
            }
            _free(value);
            return a.join("")
        },
        "toWireType": function(destructors, value) {
            var length = value.length;
            var ptr = _malloc(4 + length * charSize);
            var HEAP = getHeap();
            HEAPU32[ptr >> 2] = length;
            var start = ptr + 4 >> shift;
            for (var i = 0; i < length; ++i) {
                HEAP[start + i] = value.charCodeAt(i)
            }
            if (destructors !== null) {
                destructors.push(_free, ptr)
            }
            return ptr
        },
        "argPackAdvance": 8,
        "readValueFromPointer": simpleReadValueFromPointer,
        destructorFunction: function(ptr) {
            _free(ptr)
        }
    })
}

function __embind_register_void(rawType, name) {
    name = readLatin1String(name);
    registerType(rawType, {
        isVoid: true,
        name: name,
        "argPackAdvance": 0,
        "fromWireType": function() {
            return undefined
        },
        "toWireType": function(destructors, o) {
            return undefined
        }
    })
}

function _emscripten_set_main_loop_timing(mode, value) {
    Browser.mainLoop.timingMode = mode;
    Browser.mainLoop.timingValue = value;
    if (!Browser.mainLoop.func) {
        return 1
    }
    if (mode == 0) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setTimeout() {
            var timeUntilNextTick = Math.max(0, Browser.mainLoop.tickStartTime + value - _emscripten_get_now()) | 0;
            setTimeout(Browser.mainLoop.runner, timeUntilNextTick)
        };
        Browser.mainLoop.method = "timeout"
    } else if (mode == 1) {
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_rAF() {
            Browser.requestAnimationFrame(Browser.mainLoop.runner)
        };
        Browser.mainLoop.method = "rAF"
    } else if (mode == 2) {
        if (typeof setImmediate === "undefined") {
            var setImmediates = [];
            var emscriptenMainLoopMessageId = "setimmediate";
            var Browser_setImmediate_messageHandler = function(event) {
                if (event.data === emscriptenMainLoopMessageId || event.data.target === emscriptenMainLoopMessageId) {
                    event.stopPropagation();
                    setImmediates.shift()()
                }
            };
            addEventListener("message", Browser_setImmediate_messageHandler, true);
            setImmediate = function Browser_emulated_setImmediate(func) {
                setImmediates.push(func);
                if (ENVIRONMENT_IS_WORKER) {
                    if (Module["setImmediates"] === undefined) Module["setImmediates"] = [];
                    Module["setImmediates"].push(func);
                    postMessage({
                        target: emscriptenMainLoopMessageId
                    })
                } else postMessage(emscriptenMainLoopMessageId, "*")
            }
        }
        Browser.mainLoop.scheduler = function Browser_mainLoop_scheduler_setImmediate() {
            setImmediate(Browser.mainLoop.runner)
        };
        Browser.mainLoop.method = "immediate"
    }
    return 0
}

function _emscripten_set_main_loop(func, fps, simulateInfiniteLoop, arg, noSetTiming) {
    noExitRuntime = true;
    assert(!Browser.mainLoop.func, "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.");
    Browser.mainLoop.func = func;
    Browser.mainLoop.arg = arg;
    var browserIterationFunc;
    if (typeof arg !== "undefined") {
        browserIterationFunc = function() {
            Module["dynCall_vi"](func, arg)
        }
    } else {
        browserIterationFunc = function() {
            Module["dynCall_v"](func)
        }
    }
    var thisMainLoopId = Browser.mainLoop.currentlyRunningMainloop;
    Browser.mainLoop.runner = function Browser_mainLoop_runner() {
        if (ABORT) return;
        if (Browser.mainLoop.queue.length > 0) {
            var start = Date.now();
            var blocker = Browser.mainLoop.queue.shift();
            blocker.func(blocker.arg);
            if (Browser.mainLoop.remainingBlockers) {
                var remaining = Browser.mainLoop.remainingBlockers;
                var next = remaining % 1 == 0 ? remaining - 1 : Math.floor(remaining);
                if (blocker.counted) {
                    Browser.mainLoop.remainingBlockers = next
                } else {
                    next = next + .5;
                    Browser.mainLoop.remainingBlockers = (8 * remaining + next) / 9
                }
            }
            console.log('main loop blocker "' + blocker.name + '" took ' + (Date.now() - start) + " ms");
            Browser.mainLoop.updateStatus();
            if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
            setTimeout(Browser.mainLoop.runner, 0);
            return
        }
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
        Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0;
        if (Browser.mainLoop.timingMode == 1 && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) {
            Browser.mainLoop.scheduler();
            return
        } else if (Browser.mainLoop.timingMode == 0) {
            Browser.mainLoop.tickStartTime = _emscripten_get_now()
        }
        if (Browser.mainLoop.method === "timeout" && Module.ctx) {
            err("Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!");
            Browser.mainLoop.method = ""
        }
        Browser.mainLoop.runIter(browserIterationFunc);
        if (thisMainLoopId < Browser.mainLoop.currentlyRunningMainloop) return;
        if (typeof SDL === "object" && SDL.audio && SDL.audio.queueNewAudioData) SDL.audio.queueNewAudioData();
        Browser.mainLoop.scheduler()
    };
    if (!noSetTiming) {
        if (fps && fps > 0) _emscripten_set_main_loop_timing(0, 1e3 / fps);
        else _emscripten_set_main_loop_timing(1, 1);
        Browser.mainLoop.scheduler()
    }
    if (simulateInfiniteLoop) {
        throw "SimulateInfiniteLoop"
    }
}
var Browser = {
    mainLoop: {
        scheduler: null,
        method: "",
        currentlyRunningMainloop: 0,
        func: null,
        arg: 0,
        timingMode: 0,
        timingValue: 0,
        currentFrameNumber: 0,
        queue: [],
        pause: function() {
            Browser.mainLoop.scheduler = null;
            Browser.mainLoop.currentlyRunningMainloop++
        },
        resume: function() {
            Browser.mainLoop.currentlyRunningMainloop++;
            var timingMode = Browser.mainLoop.timingMode;
            var timingValue = Browser.mainLoop.timingValue;
            var func = Browser.mainLoop.func;
            Browser.mainLoop.func = null;
            _emscripten_set_main_loop(func, 0, false, Browser.mainLoop.arg, true);
            _emscripten_set_main_loop_timing(timingMode, timingValue);
            Browser.mainLoop.scheduler()
        },
        updateStatus: function() {
            if (Module["setStatus"]) {
                var message = Module["statusMessage"] || "Please wait...";
                var remaining = Browser.mainLoop.remainingBlockers;
                var expected = Browser.mainLoop.expectedBlockers;
                if (remaining) {
                    if (remaining < expected) {
                        Module["setStatus"](message + " (" + (expected - remaining) + "/" + expected + ")")
                    } else {
                        Module["setStatus"](message)
                    }
                } else {
                    Module["setStatus"]("")
                }
            }
        },
        runIter: function(func) {
            if (ABORT) return;
            if (Module["preMainLoop"]) {
                var preRet = Module["preMainLoop"]();
                if (preRet === false) {
                    return
                }
            }
            try {
                func()
            } catch (e) {
                if (e instanceof ExitStatus) {
                    return
                } else {
                    if (e && typeof e === "object" && e.stack) err("exception thrown: " + [e, e.stack]);
                    throw e
                }
            }
            if (Module["postMainLoop"]) Module["postMainLoop"]()
        }
    },
    isFullscreen: false,
    pointerLock: false,
    moduleContextCreatedCallbacks: [],
    workers: [],
    init: function() {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = [];
        if (Browser.initted) return;
        Browser.initted = true;
        try {
            new Blob;
            Browser.hasBlobConstructor = true
        } catch (e) {
            Browser.hasBlobConstructor = false;
            console.log("warning: no blob constructor, cannot create blobs with mimetypes")
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : !Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null;
        Browser.URLObject = typeof window != "undefined" ? window.URL ? window.URL : window.webkitURL : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject === "undefined") {
            console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
            Module.noImageDecoding = true
        }
        var imagePlugin = {};
        imagePlugin["canHandle"] = function imagePlugin_canHandle(name) {
            return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name)
        };
        imagePlugin["handle"] = function imagePlugin_handle(byteArray, name, onload, onerror) {
            var b = null;
            if (Browser.hasBlobConstructor) {
                try {
                    b = new Blob([byteArray], {
                        type: Browser.getMimetype(name)
                    });
                    if (b.size !== byteArray.length) {
                        b = new Blob([new Uint8Array(byteArray).buffer], {
                            type: Browser.getMimetype(name)
                        })
                    }
                } catch (e) {
                    warnOnce("Blob constructor present but fails: " + e + "; falling back to blob builder")
                }
            }
            if (!b) {
                var bb = new Browser.BlobBuilder;
                bb.append(new Uint8Array(byteArray).buffer);
                b = bb.getBlob()
            }
            var url = Browser.URLObject.createObjectURL(b);
            var img = new Image;
            img.onload = function img_onload() {
                assert(img.complete, "Image " + name + " could not be decoded");
                var canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0);
                Module["preloadedImages"][name] = canvas;
                Browser.URLObject.revokeObjectURL(url);
                if (onload) onload(byteArray)
            };
            img.onerror = function img_onerror(event) {
                console.log("Image " + url + " could not be decoded");
                if (onerror) onerror()
            };
            img.src = url
        };
        Module["preloadPlugins"].push(imagePlugin);
        var audioPlugin = {};
        audioPlugin["canHandle"] = function audioPlugin_canHandle(name) {
            return !Module.noAudioDecoding && name.substr(-4) in {
                ".ogg": 1,
                ".wav": 1,
                ".mp3": 1
            }
        };
        audioPlugin["handle"] = function audioPlugin_handle(byteArray, name, onload, onerror) {
            var done = false;

            function finish(audio) {
                if (done) return;
                done = true;
                Module["preloadedAudios"][name] = audio;
                if (onload) onload(byteArray)
            }

            function fail() {
                if (done) return;
                done = true;
                Module["preloadedAudios"][name] = new Audio;
                if (onerror) onerror()
            }
            if (Browser.hasBlobConstructor) {
                try {
                    var b = new Blob([byteArray], {
                        type: Browser.getMimetype(name)
                    })
                } catch (e) {
                    return fail()
                }
                var url = Browser.URLObject.createObjectURL(b);
                var audio = new Audio;
                audio.addEventListener("canplaythrough", function() {
                    finish(audio)
                }, false);
                audio.onerror = function audio_onerror(event) {
                    if (done) return;
                    console.log("warning: browser could not fully decode audio " + name + ", trying slower base64 approach");

                    function encode64(data) {
                        var BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
                        var PAD = "=";
                        var ret = "";
                        var leftchar = 0;
                        var leftbits = 0;
                        for (var i = 0; i < data.length; i++) {
                            leftchar = leftchar << 8 | data[i];
                            leftbits += 8;
                            while (leftbits >= 6) {
                                var curr = leftchar >> leftbits - 6 & 63;
                                leftbits -= 6;
                                ret += BASE[curr]
                            }
                        }
                        if (leftbits == 2) {
                            ret += BASE[(leftchar & 3) << 4];
                            ret += PAD + PAD
                        } else if (leftbits == 4) {
                            ret += BASE[(leftchar & 15) << 2];
                            ret += PAD
                        }
                        return ret
                    }
                    audio.src = "data:audio/x-" + name.substr(-3) + ";base64," + encode64(byteArray);
                    finish(audio)
                };
                audio.src = url;
                Browser.safeSetTimeout(function() {
                    finish(audio)
                }, 1e4)
            } else {
                return fail()
            }
        };
        Module["preloadPlugins"].push(audioPlugin);

        function pointerLockChange() {
            Browser.pointerLock = document["pointerLockElement"] === Module["canvas"] || document["mozPointerLockElement"] === Module["canvas"] || document["webkitPointerLockElement"] === Module["canvas"] || document["msPointerLockElement"] === Module["canvas"]
        }
        var canvas = Module["canvas"];
        if (canvas) {
            canvas.requestPointerLock = canvas["requestPointerLock"] || canvas["mozRequestPointerLock"] || canvas["webkitRequestPointerLock"] || canvas["msRequestPointerLock"] || function() {};
            canvas.exitPointerLock = document["exitPointerLock"] || document["mozExitPointerLock"] || document["webkitExitPointerLock"] || document["msExitPointerLock"] || function() {};
            canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
            document.addEventListener("pointerlockchange", pointerLockChange, false);
            document.addEventListener("mozpointerlockchange", pointerLockChange, false);
            document.addEventListener("webkitpointerlockchange", pointerLockChange, false);
            document.addEventListener("mspointerlockchange", pointerLockChange, false);
            if (Module["elementPointerLock"]) {
                canvas.addEventListener("click", function(ev) {
                    if (!Browser.pointerLock && Module["canvas"].requestPointerLock) {
                        Module["canvas"].requestPointerLock();
                        ev.preventDefault()
                    }
                }, false)
            }
        }
    },
    createContext: function(canvas, useWebGL, setInModule, webGLContextAttributes) {
        if (useWebGL && Module.ctx && canvas == Module.canvas) return Module.ctx;
        var ctx;
        var contextHandle;
        if (useWebGL) {
            var contextAttributes = {
                antialias: false,
                alpha: false,
                majorVersion: 1
            };
            if (webGLContextAttributes) {
                for (var attribute in webGLContextAttributes) {
                    contextAttributes[attribute] = webGLContextAttributes[attribute]
                }
            }
            if (typeof GL !== "undefined") {
                contextHandle = GL.createContext(canvas, contextAttributes);
                if (contextHandle) {
                    ctx = GL.getContext(contextHandle).GLctx
                }
            }
        } else {
            ctx = canvas.getContext("2d")
        }
        if (!ctx) return null;
        if (setInModule) {
            if (!useWebGL) assert(typeof GLctx === "undefined", "cannot set in module if GLctx is used, but we are a non-GL context that would replace it");
            Module.ctx = ctx;
            if (useWebGL) GL.makeContextCurrent(contextHandle);
            Module.useWebGL = useWebGL;
            Browser.moduleContextCreatedCallbacks.forEach(function(callback) {
                callback()
            });
            Browser.init()
        }
        return ctx
    },
    destroyContext: function(canvas, useWebGL, setInModule) {},
    fullscreenHandlersInstalled: false,
    lockPointer: undefined,
    resizeCanvas: undefined,
    requestFullscreen: function(lockPointer, resizeCanvas, vrDevice) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        Browser.vrDevice = vrDevice;
        if (typeof Browser.lockPointer === "undefined") Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === "undefined") Browser.resizeCanvas = false;
        if (typeof Browser.vrDevice === "undefined") Browser.vrDevice = null;
        var canvas = Module["canvas"];

        function fullscreenChange() {
            Browser.isFullscreen = false;
            var canvasContainer = canvas.parentNode;
            if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvasContainer) {
                canvas.exitFullscreen = Browser.exitFullscreen;
                if (Browser.lockPointer) canvas.requestPointerLock();
                Browser.isFullscreen = true;
                if (Browser.resizeCanvas) {
                    Browser.setFullscreenCanvasSize()
                } else {
                    Browser.updateCanvasDimensions(canvas)
                }
            } else {
                canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
                canvasContainer.parentNode.removeChild(canvasContainer);
                if (Browser.resizeCanvas) {
                    Browser.setWindowedCanvasSize()
                } else {
                    Browser.updateCanvasDimensions(canvas)
                }
            }
            if (Module["onFullScreen"]) Module["onFullScreen"](Browser.isFullscreen);
            if (Module["onFullscreen"]) Module["onFullscreen"](Browser.isFullscreen)
        }
        if (!Browser.fullscreenHandlersInstalled) {
            Browser.fullscreenHandlersInstalled = true;
            document.addEventListener("fullscreenchange", fullscreenChange, false);
            document.addEventListener("mozfullscreenchange", fullscreenChange, false);
            document.addEventListener("webkitfullscreenchange", fullscreenChange, false);
            document.addEventListener("MSFullscreenChange", fullscreenChange, false)
        }
        var canvasContainer = document.createElement("div");
        canvas.parentNode.insertBefore(canvasContainer, canvas);
        canvasContainer.appendChild(canvas);
        canvasContainer.requestFullscreen = canvasContainer["requestFullscreen"] || canvasContainer["mozRequestFullScreen"] || canvasContainer["msRequestFullscreen"] || (canvasContainer["webkitRequestFullscreen"] ? function() {
            canvasContainer["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"])
        } : null) || (canvasContainer["webkitRequestFullScreen"] ? function() {
            canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"])
        } : null);
        if (vrDevice) {
            canvasContainer.requestFullscreen({
                vrDisplay: vrDevice
            })
        } else {
            canvasContainer.requestFullscreen()
        }
    },
    requestFullScreen: function(lockPointer, resizeCanvas, vrDevice) {
        err("Browser.requestFullScreen() is deprecated. Please call Browser.requestFullscreen instead.");
        Browser.requestFullScreen = function(lockPointer, resizeCanvas, vrDevice) {
            return Browser.requestFullscreen(lockPointer, resizeCanvas, vrDevice)
        };
        return Browser.requestFullscreen(lockPointer, resizeCanvas, vrDevice)
    },
    exitFullscreen: function() {
        if (!Browser.isFullscreen) {
            return false
        }
        var CFS = document["exitFullscreen"] || document["cancelFullScreen"] || document["mozCancelFullScreen"] || document["msExitFullscreen"] || document["webkitCancelFullScreen"] || function() {};
        CFS.apply(document, []);
        return true
    },
    nextRAF: 0,
    fakeRequestAnimationFrame: function(func) {
        var now = Date.now();
        if (Browser.nextRAF === 0) {
            Browser.nextRAF = now + 1e3 / 60
        } else {
            while (now + 2 >= Browser.nextRAF) {
                Browser.nextRAF += 1e3 / 60
            }
        }
        var delay = Math.max(Browser.nextRAF - now, 0);
        setTimeout(func, delay)
    },
    requestAnimationFrame: function(func) {
        if (typeof requestAnimationFrame === "function") {
            requestAnimationFrame(func);
            return
        }
        var RAF = Browser.fakeRequestAnimationFrame;
        RAF(func)
    },
    safeCallback: function(func) {
        return function() {
            if (!ABORT) return func.apply(null, arguments)
        }
    },
    allowAsyncCallbacks: true,
    queuedAsyncCallbacks: [],
    pauseAsyncCallbacks: function() {
        Browser.allowAsyncCallbacks = false
    },
    resumeAsyncCallbacks: function() {
        Browser.allowAsyncCallbacks = true;
        if (Browser.queuedAsyncCallbacks.length > 0) {
            var callbacks = Browser.queuedAsyncCallbacks;
            Browser.queuedAsyncCallbacks = [];
            callbacks.forEach(function(func) {
                func()
            })
        }
    },
    safeRequestAnimationFrame: function(func) {
        return Browser.requestAnimationFrame(function() {
            if (ABORT) return;
            if (Browser.allowAsyncCallbacks) {
                func()
            } else {
                Browser.queuedAsyncCallbacks.push(func)
            }
        })
    },
    safeSetTimeout: function(func, timeout) {
        noExitRuntime = true;
        return setTimeout(function() {
            if (ABORT) return;
            if (Browser.allowAsyncCallbacks) {
                func()
            } else {
                Browser.queuedAsyncCallbacks.push(func)
            }
        }, timeout)
    },
    safeSetInterval: function(func, timeout) {
        noExitRuntime = true;
        return setInterval(function() {
            if (ABORT) return;
            if (Browser.allowAsyncCallbacks) {
                func()
            }
        }, timeout)
    },
    getMimetype: function(name) {
        return {
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "png": "image/png",
            "bmp": "image/bmp",
            "ogg": "audio/ogg",
            "wav": "audio/wav",
            "mp3": "audio/mpeg"
        }[name.substr(name.lastIndexOf(".") + 1)]
    },
    getUserMedia: function(func) {
        if (!window.getUserMedia) {
            window.getUserMedia = navigator["getUserMedia"] || navigator["mozGetUserMedia"]
        }
        window.getUserMedia(func)
    },
    getMovementX: function(event) {
        return event["movementX"] || event["mozMovementX"] || event["webkitMovementX"] || 0
    },
    getMovementY: function(event) {
        return event["movementY"] || event["mozMovementY"] || event["webkitMovementY"] || 0
    },
    getMouseWheelDelta: function(event) {
        var delta = 0;
        switch (event.type) {
            case "DOMMouseScroll":
                delta = event.detail / 3;
                break;
            case "mousewheel":
                delta = event.wheelDelta / 120;
                break;
            case "wheel":
                delta = event.deltaY;
                switch (event.deltaMode) {
                    case 0:
                        delta /= 100;
                        break;
                    case 1:
                        delta /= 3;
                        break;
                    case 2:
                        delta *= 80;
                        break;
                    default:
                        throw "unrecognized mouse wheel delta mode: " + event.deltaMode
                }
                break;
            default:
                throw "unrecognized mouse wheel event: " + event.type
        }
        return delta
    },
    mouseX: 0,
    mouseY: 0,
    mouseMovementX: 0,
    mouseMovementY: 0,
    touches: {},
    lastTouches: {},
    calculateMouseEvent: function(event) {
        if (Browser.pointerLock) {
            if (event.type != "mousemove" && "mozMovementX" in event) {
                Browser.mouseMovementX = Browser.mouseMovementY = 0
            } else {
                Browser.mouseMovementX = Browser.getMovementX(event);
                Browser.mouseMovementY = Browser.getMovementY(event)
            }
            if (typeof SDL != "undefined") {
                Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
                Browser.mouseY = SDL.mouseY + Browser.mouseMovementY
            } else {
                Browser.mouseX += Browser.mouseMovementX;
                Browser.mouseY += Browser.mouseMovementY
            }
        } else {
            var rect = Module["canvas"].getBoundingClientRect();
            var cw = Module["canvas"].width;
            var ch = Module["canvas"].height;
            var scrollX = typeof window.scrollX !== "undefined" ? window.scrollX : window.pageXOffset;
            var scrollY = typeof window.scrollY !== "undefined" ? window.scrollY : window.pageYOffset;
            if (event.type === "touchstart" || event.type === "touchend" || event.type === "touchmove") {
                var touch = event.touch;
                if (touch === undefined) {
                    return
                }
                var adjustedX = touch.pageX - (scrollX + rect.left);
                var adjustedY = touch.pageY - (scrollY + rect.top);
                adjustedX = adjustedX * (cw / rect.width);
                adjustedY = adjustedY * (ch / rect.height);
                var coords = {
                    x: adjustedX,
                    y: adjustedY
                };
                if (event.type === "touchstart") {
                    Browser.lastTouches[touch.identifier] = coords;
                    Browser.touches[touch.identifier] = coords
                } else if (event.type === "touchend" || event.type === "touchmove") {
                    var last = Browser.touches[touch.identifier];
                    if (!last) last = coords;
                    Browser.lastTouches[touch.identifier] = last;
                    Browser.touches[touch.identifier] = coords
                }
                return
            }
            var x = event.pageX - (scrollX + rect.left);
            var y = event.pageY - (scrollY + rect.top);
            x = x * (cw / rect.width);
            y = y * (ch / rect.height);
            Browser.mouseMovementX = x - Browser.mouseX;
            Browser.mouseMovementY = y - Browser.mouseY;
            Browser.mouseX = x;
            Browser.mouseY = y
        }
    },
    asyncLoad: function(url, onload, onerror, noRunDep) {
        var dep = !noRunDep ? getUniqueRunDependency("al " + url) : "";
        readAsync(url, function(arrayBuffer) {
            assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
            onload(new Uint8Array(arrayBuffer));
            if (dep) removeRunDependency(dep)
        }, function(event) {
            if (onerror) {
                onerror()
            } else {
                throw 'Loading data file "' + url + '" failed.'
            }
        });
        if (dep) addRunDependency(dep)
    },
    resizeListeners: [],
    updateResizeListeners: function() {
        var canvas = Module["canvas"];
        Browser.resizeListeners.forEach(function(listener) {
            listener(canvas.width, canvas.height)
        })
    },
    setCanvasSize: function(width, height, noUpdates) {
        var canvas = Module["canvas"];
        Browser.updateCanvasDimensions(canvas, width, height);
        if (!noUpdates) Browser.updateResizeListeners()
    },
    windowedWidth: 0,
    windowedHeight: 0,
    setFullscreenCanvasSize: function() {
        if (typeof SDL != "undefined") {
            var flags = HEAPU32[SDL.screen >> 2];
            flags = flags | 8388608;
            HEAP32[SDL.screen >> 2] = flags
        }
        Browser.updateCanvasDimensions(Module["canvas"]);
        Browser.updateResizeListeners()
    },
    setWindowedCanvasSize: function() {
        if (typeof SDL != "undefined") {
            var flags = HEAPU32[SDL.screen >> 2];
            flags = flags & ~8388608;
            HEAP32[SDL.screen >> 2] = flags
        }
        Browser.updateCanvasDimensions(Module["canvas"]);
        Browser.updateResizeListeners()
    },
    updateCanvasDimensions: function(canvas, wNative, hNative) {
        if (wNative && hNative) {
            canvas.widthNative = wNative;
            canvas.heightNative = hNative
        } else {
            wNative = canvas.widthNative;
            hNative = canvas.heightNative
        }
        var w = wNative;
        var h = hNative;
        if (Module["forcedAspectRatio"] && Module["forcedAspectRatio"] > 0) {
            if (w / h < Module["forcedAspectRatio"]) {
                w = Math.round(h * Module["forcedAspectRatio"])
            } else {
                h = Math.round(w / Module["forcedAspectRatio"])
            }
        }
        if ((document["fullscreenElement"] || document["mozFullScreenElement"] || document["msFullscreenElement"] || document["webkitFullscreenElement"] || document["webkitCurrentFullScreenElement"]) === canvas.parentNode && typeof screen != "undefined") {
            var factor = Math.min(screen.width / w, screen.height / h);
            w = Math.round(w * factor);
            h = Math.round(h * factor)
        }
        if (Browser.resizeCanvas) {
            if (canvas.width != w) canvas.width = w;
            if (canvas.height != h) canvas.height = h;
            if (typeof canvas.style != "undefined") {
                canvas.style.removeProperty("width");
                canvas.style.removeProperty("height")
            }
        } else {
            if (canvas.width != wNative) canvas.width = wNative;
            if (canvas.height != hNative) canvas.height = hNative;
            if (typeof canvas.style != "undefined") {
                if (w != wNative || h != hNative) {
                    canvas.style.setProperty("width", w + "px", "important");
                    canvas.style.setProperty("height", h + "px", "important")
                } else {
                    canvas.style.removeProperty("width");
                    canvas.style.removeProperty("height")
                }
            }
        }
    },
    wgetRequests: {},
    nextWgetRequestHandle: 0,
    getNextWgetRequestHandle: function() {
        var handle = Browser.nextWgetRequestHandle;
        Browser.nextWgetRequestHandle++;
        return handle
    }
};

function __emscripten_push_main_loop_blocker(func, arg, name) {
    Browser.mainLoop.queue.push({
        func: function() {
            dynCall_vi(func, arg)
        },
        name: UTF8ToString(name),
        counted: true
    });
    Browser.mainLoop.updateStatus()
}

function requireHandle(handle) {
    if (!handle) {
        throwBindingError("Cannot use deleted val. handle = " + handle)
    }
    return emval_handle_array[handle].value
}

function __emval_as(handle, returnType, destructorsRef) {
    handle = requireHandle(handle);
    returnType = requireRegisteredType(returnType, "emval::as");
    var destructors = [];
    var rd = __emval_register(destructors);
    HEAP32[destructorsRef >> 2] = rd;
    return returnType["toWireType"](destructors, handle)
}
var emval_symbols = {};

function getStringOrSymbol(address) {
    var symbol = emval_symbols[address];
    if (symbol === undefined) {
        return readLatin1String(address)
    } else {
        return symbol
    }
}

function emval_get_global() {
    if (typeof globalThis === "object") {
        return globalThis
    }
    return function() {
        return Function
    }()("return this")()
}

function __emval_get_global(name) {
    if (name === 0) {
        return __emval_register(emval_get_global())
    } else {
        name = getStringOrSymbol(name);
        return __emval_register(emval_get_global()[name])
    }
}

function __emval_get_property(handle, key) {
    handle = requireHandle(handle);
    key = requireHandle(key);
    return __emval_register(handle[key])
}

function __emval_new_cstring(v) {
    return __emval_register(getStringOrSymbol(v))
}

function __emval_run_destructors(handle) {
    var destructors = emval_handle_array[handle].value;
    runDestructors(destructors);
    __emval_decref(handle)
}

function _abort() {
    abort()
}

function _clock() {
    if (_clock.start === undefined) _clock.start = Date.now();
    return (Date.now() - _clock.start) * (1e6 / 1e3) | 0
}

function _difftime(time1, time0) {
    return time1 - time0
}

function _emscripten_async_wget_data(url, arg, onload, onerror) {
    Browser.asyncLoad(UTF8ToString(url), function(byteArray) {
        var buffer = _malloc(byteArray.length);
        HEAPU8.set(byteArray, buffer);
        dynCall_viii(onload, arg, buffer, byteArray.length);
        _free(buffer)
    }, function() {
        if (onerror) dynCall_vi(onerror, arg)
    }, true)
}

function _emscripten_cancel_main_loop() {
    Browser.mainLoop.pause();
    Browser.mainLoop.func = null
}

function _emscripten_get_heap_size() {
    return HEAP8.length
}

function _longjmp(env, value) {
    _setThrew(env, value || 1);
    throw "longjmp"
}

function _emscripten_longjmp(env, value) {
    _longjmp(env, value)
}

function emscripten_realloc_buffer(size) {
    try {
        wasmMemory.grow(size - buffer.byteLength + 65535 >> 16);
        updateGlobalBufferAndViews(wasmMemory.buffer);
        return 1
    } catch (e) {}
}

function _emscripten_resize_heap(requestedSize) {
    var oldSize = _emscripten_get_heap_size();
    var PAGE_MULTIPLE = 65536;
    var LIMIT = 2147483648 - PAGE_MULTIPLE;
    if (requestedSize > LIMIT) {
        return false
    }
    var MIN_TOTAL_MEMORY = 16777216;
    var newSize = Math.max(oldSize, MIN_TOTAL_MEMORY);
    while (newSize < requestedSize) {
        if (newSize <= 536870912) {
            newSize = alignUp(2 * newSize, PAGE_MULTIPLE)
        } else {
            newSize = Math.min(alignUp((3 * newSize + 2147483648) / 4, PAGE_MULTIPLE), LIMIT)
        }
    }
    var replacement = emscripten_realloc_buffer(newSize);
    if (!replacement) {
        return false
    }
    return true
}

function _emscripten_run_script_string(ptr) {
    var s = eval(UTF8ToString(ptr));
    if (s == null) {
        return 0
    }
    s += "";
    var me = _emscripten_run_script_string;
    var len = lengthBytesUTF8(s);
    if (!me.bufferSize || me.bufferSize < len + 1) {
        if (me.bufferSize) _free(me.buffer);
        me.bufferSize = len + 1;
        me.buffer = _malloc(me.bufferSize)
    }
    stringToUTF8(s, me.buffer, me.bufferSize);
    return me.buffer
}
var JSEvents = {
    keyEvent: 0,
    mouseEvent: 0,
    wheelEvent: 0,
    uiEvent: 0,
    focusEvent: 0,
    deviceOrientationEvent: 0,
    deviceMotionEvent: 0,
    fullscreenChangeEvent: 0,
    pointerlockChangeEvent: 0,
    visibilityChangeEvent: 0,
    touchEvent: 0,
    previousFullscreenElement: null,
    previousScreenX: null,
    previousScreenY: null,
    removeEventListenersRegistered: false,
    removeAllEventListeners: function() {
        for (var i = JSEvents.eventHandlers.length - 1; i >= 0; --i) {
            JSEvents._removeHandler(i)
        }
        JSEvents.eventHandlers = [];
        JSEvents.deferredCalls = []
    },
    registerRemoveEventListeners: function() {
        if (!JSEvents.removeEventListenersRegistered) {
            __ATEXIT__.push(JSEvents.removeAllEventListeners);
            JSEvents.removeEventListenersRegistered = true
        }
    },
    deferredCalls: [],
    deferCall: function(targetFunction, precedence, argsList) {
        function arraysHaveEqualContent(arrA, arrB) {
            if (arrA.length != arrB.length) return false;
            for (var i in arrA) {
                if (arrA[i] != arrB[i]) return false
            }
            return true
        }
        for (var i in JSEvents.deferredCalls) {
            var call = JSEvents.deferredCalls[i];
            if (call.targetFunction == targetFunction && arraysHaveEqualContent(call.argsList, argsList)) {
                return
            }
        }
        JSEvents.deferredCalls.push({
            targetFunction: targetFunction,
            precedence: precedence,
            argsList: argsList
        });
        JSEvents.deferredCalls.sort(function(x, y) {
            return x.precedence < y.precedence
        })
    },
    removeDeferredCalls: function(targetFunction) {
        for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
            if (JSEvents.deferredCalls[i].targetFunction == targetFunction) {
                JSEvents.deferredCalls.splice(i, 1);
                --i
            }
        }
    },
    canPerformEventHandlerRequests: function() {
        return JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls
    },
    runDeferredCalls: function() {
        if (!JSEvents.canPerformEventHandlerRequests()) {
            return
        }
        for (var i = 0; i < JSEvents.deferredCalls.length; ++i) {
            var call = JSEvents.deferredCalls[i];
            JSEvents.deferredCalls.splice(i, 1);
            --i;
            call.targetFunction.apply(this, call.argsList)
        }
    },
    inEventHandler: 0,
    currentEventHandler: null,
    eventHandlers: [],
    isInternetExplorer: function() {
        return navigator.userAgent.indexOf("MSIE") !== -1 || navigator.appVersion.indexOf("Trident/") > 0
    },
    removeAllHandlersOnTarget: function(target, eventTypeString) {
        for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
            if (JSEvents.eventHandlers[i].target == target && (!eventTypeString || eventTypeString == JSEvents.eventHandlers[i].eventTypeString)) {
                JSEvents._removeHandler(i--)
            }
        }
    },
    _removeHandler: function(i) {
        var h = JSEvents.eventHandlers[i];
        h.target.removeEventListener(h.eventTypeString, h.eventListenerFunc, h.useCapture);
        JSEvents.eventHandlers.splice(i, 1)
    },
    registerOrRemoveHandler: function(eventHandler) {
        var jsEventHandler = function jsEventHandler(event) {
            ++JSEvents.inEventHandler;
            JSEvents.currentEventHandler = eventHandler;
            JSEvents.runDeferredCalls();
            eventHandler.handlerFunc(event);
            JSEvents.runDeferredCalls();
            --JSEvents.inEventHandler
        };
        if (eventHandler.callbackfunc) {
            eventHandler.eventListenerFunc = jsEventHandler;
            eventHandler.target.addEventListener(eventHandler.eventTypeString, jsEventHandler, eventHandler.useCapture);
            JSEvents.eventHandlers.push(eventHandler);
            JSEvents.registerRemoveEventListeners()
        } else {
            for (var i = 0; i < JSEvents.eventHandlers.length; ++i) {
                if (JSEvents.eventHandlers[i].target == eventHandler.target && JSEvents.eventHandlers[i].eventTypeString == eventHandler.eventTypeString) {
                    JSEvents._removeHandler(i--)
                }
            }
        }
    },
    getBoundingClientRectOrZeros: function(target) {
        return target.getBoundingClientRect ? target.getBoundingClientRect() : {
            left: 0,
            top: 0
        }
    },
    pageScrollPos: function() {
        if (pageXOffset > 0 || pageYOffset > 0) {
            return [pageXOffset, pageYOffset]
        }
        if (typeof document.documentElement.scrollLeft !== "undefined" || typeof document.documentElement.scrollTop !== "undefined") {
            return [document.documentElement.scrollLeft, document.documentElement.scrollTop]
        }
        return [document.body.scrollLeft | 0, document.body.scrollTop | 0]
    },
    getNodeNameForTarget: function(target) {
        if (!target) return "";
        if (target == window) return "#window";
        if (target == screen) return "#screen";
        return target && target.nodeName ? target.nodeName : ""
    },
    tick: function() {
        if (window["performance"] && window["performance"]["now"]) return window["performance"]["now"]();
        else return Date.now()
    },
    fullscreenEnabled: function() {
        return document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled
    }
};
var __specialEventTargets = [0, typeof document !== "undefined" ? document : 0, typeof window !== "undefined" ? window : 0];

function __findEventTarget(target) {
    try {
        if (!target) return window;
        if (typeof target === "number") target = __specialEventTargets[target] || UTF8ToString(target);
        if (target === "#window") return window;
        else if (target === "#document") return document;
        else if (target === "#screen") return screen;
        else if (target === "#canvas") return Module["canvas"];
        return typeof target === "string" ? document.getElementById(target) : target
    } catch (e) {
        return null
    }
}

function __registerKeyEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
    if (!JSEvents.keyEvent) JSEvents.keyEvent = _malloc(164);
    var keyEventHandlerFunc = function(ev) {
        var e = ev || event;
        var keyEventData = JSEvents.keyEvent;
        stringToUTF8(e.key ? e.key : "", keyEventData + 0, 32);
        stringToUTF8(e.code ? e.code : "", keyEventData + 32, 32);
        HEAP32[keyEventData + 64 >> 2] = e.location;
        HEAP32[keyEventData + 68 >> 2] = e.ctrlKey;
        HEAP32[keyEventData + 72 >> 2] = e.shiftKey;
        HEAP32[keyEventData + 76 >> 2] = e.altKey;
        HEAP32[keyEventData + 80 >> 2] = e.metaKey;
        HEAP32[keyEventData + 84 >> 2] = e.repeat;
        stringToUTF8(e.locale ? e.locale : "", keyEventData + 88, 32);
        stringToUTF8(e.char ? e.char : "", keyEventData + 120, 32);
        HEAP32[keyEventData + 152 >> 2] = e.charCode;
        HEAP32[keyEventData + 156 >> 2] = e.keyCode;
        HEAP32[keyEventData + 160 >> 2] = e.which;
        if (dynCall_iiii(callbackfunc, eventTypeId, keyEventData, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: __findEventTarget(target),
        allowsDeferredCalls: JSEvents.isInternetExplorer() ? false : true,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: keyEventHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_keydown_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    __registerKeyEventCallback(target, userData, useCapture, callbackfunc, 2, "keydown", targetThread);
    return 0
}

function _emscripten_set_keypress_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    __registerKeyEventCallback(target, userData, useCapture, callbackfunc, 1, "keypress", targetThread);
    return 0
}

function _emscripten_set_keyup_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    __registerKeyEventCallback(target, userData, useCapture, callbackfunc, 3, "keyup", targetThread);
    return 0
}

function __fillMouseEventData(eventStruct, e, target) {
    HEAPF64[eventStruct >> 3] = JSEvents.tick();
    HEAP32[eventStruct + 8 >> 2] = e.screenX;
    HEAP32[eventStruct + 12 >> 2] = e.screenY;
    HEAP32[eventStruct + 16 >> 2] = e.clientX;
    HEAP32[eventStruct + 20 >> 2] = e.clientY;
    HEAP32[eventStruct + 24 >> 2] = e.ctrlKey;
    HEAP32[eventStruct + 28 >> 2] = e.shiftKey;
    HEAP32[eventStruct + 32 >> 2] = e.altKey;
    HEAP32[eventStruct + 36 >> 2] = e.metaKey;
    HEAP16[eventStruct + 40 >> 1] = e.button;
    HEAP16[eventStruct + 42 >> 1] = e.buttons;
    HEAP32[eventStruct + 44 >> 2] = e["movementX"] || e["mozMovementX"] || e["webkitMovementX"] || e.screenX - JSEvents.previousScreenX;
    HEAP32[eventStruct + 48 >> 2] = e["movementY"] || e["mozMovementY"] || e["webkitMovementY"] || e.screenY - JSEvents.previousScreenY;
    if (Module["canvas"]) {
        var rect = Module["canvas"].getBoundingClientRect();
        HEAP32[eventStruct + 60 >> 2] = e.clientX - rect.left;
        HEAP32[eventStruct + 64 >> 2] = e.clientY - rect.top
    } else {
        HEAP32[eventStruct + 60 >> 2] = 0;
        HEAP32[eventStruct + 64 >> 2] = 0
    }
    if (target) {
        var rect = JSEvents.getBoundingClientRectOrZeros(target);
        HEAP32[eventStruct + 52 >> 2] = e.clientX - rect.left;
        HEAP32[eventStruct + 56 >> 2] = e.clientY - rect.top
    } else {
        HEAP32[eventStruct + 52 >> 2] = 0;
        HEAP32[eventStruct + 56 >> 2] = 0
    }
    if (e.type !== "wheel" && e.type !== "mousewheel") {
        JSEvents.previousScreenX = e.screenX;
        JSEvents.previousScreenY = e.screenY
    }
}

function __registerMouseEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
    if (!JSEvents.mouseEvent) JSEvents.mouseEvent = _malloc(72);
    target = __findEventTarget(target);
    var mouseEventHandlerFunc = function(ev) {
        var e = ev || event;
        __fillMouseEventData(JSEvents.mouseEvent, e, target);
        if (dynCall_iiii(callbackfunc, eventTypeId, JSEvents.mouseEvent, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: target,
        allowsDeferredCalls: eventTypeString != "mousemove" && eventTypeString != "mouseenter" && eventTypeString != "mouseleave",
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: mouseEventHandlerFunc,
        useCapture: useCapture
    };
    if (JSEvents.isInternetExplorer() && eventTypeString == "mousedown") eventHandler.allowsDeferredCalls = false;
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_mousedown_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    __registerMouseEventCallback(target, userData, useCapture, callbackfunc, 5, "mousedown", targetThread);
    return 0
}

function _emscripten_set_mouseleave_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    __registerMouseEventCallback(target, userData, useCapture, callbackfunc, 34, "mouseleave", targetThread);
    return 0
}

function _emscripten_set_mousemove_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    __registerMouseEventCallback(target, userData, useCapture, callbackfunc, 8, "mousemove", targetThread);
    return 0
}

function _emscripten_set_mouseup_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    __registerMouseEventCallback(target, userData, useCapture, callbackfunc, 6, "mouseup", targetThread);
    return 0
}

function __registerTouchEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
    if (!JSEvents.touchEvent) JSEvents.touchEvent = _malloc(1684);
    target = __findEventTarget(target);
    var touchEventHandlerFunc = function(ev) {
        var e = ev || event;
        var touches = {};
        for (var i = 0; i < e.touches.length; ++i) {
            var touch = e.touches[i];
            touch.changed = false;
            touches[touch.identifier] = touch
        }
        for (var i = 0; i < e.changedTouches.length; ++i) {
            var touch = e.changedTouches[i];
            touches[touch.identifier] = touch;
            touch.changed = true
        }
        for (var i = 0; i < e.targetTouches.length; ++i) {
            var touch = e.targetTouches[i];
            touches[touch.identifier].onTarget = true
        }
        var touchEvent = JSEvents.touchEvent;
        var ptr = touchEvent;
        HEAP32[ptr + 4 >> 2] = e.ctrlKey;
        HEAP32[ptr + 8 >> 2] = e.shiftKey;
        HEAP32[ptr + 12 >> 2] = e.altKey;
        HEAP32[ptr + 16 >> 2] = e.metaKey;
        ptr += 20;
        var canvasRect = Module["canvas"] ? Module["canvas"].getBoundingClientRect() : undefined;
        var targetRect = JSEvents.getBoundingClientRectOrZeros(target);
        var numTouches = 0;
        for (var i in touches) {
            var t = touches[i];
            HEAP32[ptr >> 2] = t.identifier;
            HEAP32[ptr + 4 >> 2] = t.screenX;
            HEAP32[ptr + 8 >> 2] = t.screenY;
            HEAP32[ptr + 12 >> 2] = t.clientX;
            HEAP32[ptr + 16 >> 2] = t.clientY;
            HEAP32[ptr + 20 >> 2] = t.pageX;
            HEAP32[ptr + 24 >> 2] = t.pageY;
            HEAP32[ptr + 28 >> 2] = t.changed;
            HEAP32[ptr + 32 >> 2] = t.onTarget;
            if (canvasRect) {
                HEAP32[ptr + 44 >> 2] = t.clientX - canvasRect.left;
                HEAP32[ptr + 48 >> 2] = t.clientY - canvasRect.top
            } else {
                HEAP32[ptr + 44 >> 2] = 0;
                HEAP32[ptr + 48 >> 2] = 0
            }
            HEAP32[ptr + 36 >> 2] = t.clientX - targetRect.left;
            HEAP32[ptr + 40 >> 2] = t.clientY - targetRect.top;
            ptr += 52;
            if (++numTouches >= 32) {
                break
            }
        }
        HEAP32[touchEvent >> 2] = numTouches;
        if (dynCall_iiii(callbackfunc, eventTypeId, touchEvent, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: target,
        allowsDeferredCalls: eventTypeString == "touchstart" || eventTypeString == "touchend",
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: touchEventHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_touchcancel_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    __registerTouchEventCallback(target, userData, useCapture, callbackfunc, 25, "touchcancel", targetThread);
    return 0
}

function _emscripten_set_touchend_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    __registerTouchEventCallback(target, userData, useCapture, callbackfunc, 23, "touchend", targetThread);
    return 0
}

function _emscripten_set_touchmove_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    __registerTouchEventCallback(target, userData, useCapture, callbackfunc, 24, "touchmove", targetThread);
    return 0
}

function _emscripten_set_touchstart_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    __registerTouchEventCallback(target, userData, useCapture, callbackfunc, 22, "touchstart", targetThread);
    return 0
}

function __fillVisibilityChangeEventData(eventStruct, e) {
    var visibilityStates = ["hidden", "visible", "prerender", "unloaded"];
    var visibilityState = visibilityStates.indexOf(document.visibilityState);
    HEAP32[eventStruct >> 2] = document.hidden;
    HEAP32[eventStruct + 4 >> 2] = visibilityState
}

function __registerVisibilityChangeEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
    if (!JSEvents.visibilityChangeEvent) JSEvents.visibilityChangeEvent = _malloc(8);
    var visibilityChangeEventHandlerFunc = function(ev) {
        var e = ev || event;
        var visibilityChangeEvent = JSEvents.visibilityChangeEvent;
        __fillVisibilityChangeEventData(visibilityChangeEvent, e);
        if (dynCall_iiii(callbackfunc, eventTypeId, visibilityChangeEvent, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: target,
        allowsDeferredCalls: false,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: visibilityChangeEventHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_visibilitychange_callback_on_thread(userData, useCapture, callbackfunc, targetThread) {
    if (!__specialEventTargets[1]) {
        return -4
    }
    __registerVisibilityChangeEventCallback(__specialEventTargets[1], userData, useCapture, callbackfunc, 21, "visibilitychange", targetThread);
    return 0
}

function __registerWebGlEventCallback(target, userData, useCapture, callbackfunc, eventTypeId, eventTypeString, targetThread) {
    if (!target) target = Module["canvas"];
    var webGlEventHandlerFunc = function(ev) {
        var e = ev || event;
        if (dynCall_iiii(callbackfunc, eventTypeId, 0, userData)) e.preventDefault()
    };
    var eventHandler = {
        target: __findEventTarget(target),
        allowsDeferredCalls: false,
        eventTypeString: eventTypeString,
        callbackfunc: callbackfunc,
        handlerFunc: webGlEventHandlerFunc,
        useCapture: useCapture
    };
    JSEvents.registerOrRemoveHandler(eventHandler)
}

function _emscripten_set_webglcontextlost_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    __registerWebGlEventCallback(target, userData, useCapture, callbackfunc, 31, "webglcontextlost", targetThread);
    return 0
}

function _emscripten_set_webglcontextrestored_callback_on_thread(target, userData, useCapture, callbackfunc, targetThread) {
    __registerWebGlEventCallback(target, userData, useCapture, callbackfunc, 32, "webglcontextrestored", targetThread);
    return 0
}
var GL = {
    counter: 1,
    lastError: 0,
    buffers: [],
    mappedBuffers: {},
    programs: [],
    framebuffers: [],
    renderbuffers: [],
    textures: [],
    uniforms: [],
    shaders: [],
    vaos: [],
    contexts: {},
    currentContext: null,
    offscreenCanvases: {},
    timerQueriesEXT: [],
    programInfos: {},
    stringCache: {},
    unpackAlignment: 4,
    init: function() {
        GL.miniTempBuffer = new Float32Array(GL.MINI_TEMP_BUFFER_SIZE);
        for (var i = 0; i < GL.MINI_TEMP_BUFFER_SIZE; i++) {
            GL.miniTempBufferViews[i] = GL.miniTempBuffer.subarray(0, i + 1)
        }
    },
    recordError: function recordError(errorCode) {
        if (!GL.lastError) {
            GL.lastError = errorCode
        }
    },
    getNewId: function(table) {
        var ret = GL.counter++;
        for (var i = table.length; i < ret; i++) {
            table[i] = null
        }
        return ret
    },
    MINI_TEMP_BUFFER_SIZE: 256,
    miniTempBuffer: null,
    miniTempBufferViews: [0],
    getSource: function(shader, count, string, length) {
        var source = "";
        for (var i = 0; i < count; ++i) {
            var len = length ? HEAP32[length + i * 4 >> 2] : -1;
            source += UTF8ToString(HEAP32[string + i * 4 >> 2], len < 0 ? undefined : len)
        }
        return source
    },
    createContext: function(canvas, webGLContextAttributes) {
        var ctx = canvas.getContext("webgl", webGLContextAttributes) || canvas.getContext("experimental-webgl", webGLContextAttributes);
        if (!ctx) return 0;
        var handle = GL.registerContext(ctx, webGLContextAttributes);
        return handle
    },
    registerContext: function(ctx, webGLContextAttributes) {
        var handle = _malloc(8);
        var context = {
            handle: handle,
            attributes: webGLContextAttributes,
            version: webGLContextAttributes.majorVersion,
            GLctx: ctx
        };
        if (ctx.canvas) ctx.canvas.GLctxObject = context;
        GL.contexts[handle] = context;
        if (typeof webGLContextAttributes.enableExtensionsByDefault === "undefined" || webGLContextAttributes.enableExtensionsByDefault) {
            GL.initExtensions(context)
        }
        return handle
    },
    makeContextCurrent: function(contextHandle) {
        GL.currentContext = GL.contexts[contextHandle];
        Module.ctx = GLctx = GL.currentContext && GL.currentContext.GLctx;
        return !(contextHandle && !GLctx)
    },
    getContext: function(contextHandle) {
        return GL.contexts[contextHandle]
    },
    deleteContext: function(contextHandle) {
        if (GL.currentContext === GL.contexts[contextHandle]) GL.currentContext = null;
        if (typeof JSEvents === "object") JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);
        if (GL.contexts[contextHandle] && GL.contexts[contextHandle].GLctx.canvas) GL.contexts[contextHandle].GLctx.canvas.GLctxObject = undefined;
        _free(GL.contexts[contextHandle]);
        GL.contexts[contextHandle] = null
    },
    acquireInstancedArraysExtension: function(ctx) {
        var ext = ctx.getExtension("ANGLE_instanced_arrays");
        if (ext) {
            ctx["vertexAttribDivisor"] = function(index, divisor) {
                ext["vertexAttribDivisorANGLE"](index, divisor)
            };
            ctx["drawArraysInstanced"] = function(mode, first, count, primcount) {
                ext["drawArraysInstancedANGLE"](mode, first, count, primcount)
            };
            ctx["drawElementsInstanced"] = function(mode, count, type, indices, primcount) {
                ext["drawElementsInstancedANGLE"](mode, count, type, indices, primcount)
            }
        }
    },
    acquireVertexArrayObjectExtension: function(ctx) {
        var ext = ctx.getExtension("OES_vertex_array_object");
        if (ext) {
            ctx["createVertexArray"] = function() {
                return ext["createVertexArrayOES"]()
            };
            ctx["deleteVertexArray"] = function(vao) {
                ext["deleteVertexArrayOES"](vao)
            };
            ctx["bindVertexArray"] = function(vao) {
                ext["bindVertexArrayOES"](vao)
            };
            ctx["isVertexArray"] = function(vao) {
                return ext["isVertexArrayOES"](vao)
            }
        }
    },
    acquireDrawBuffersExtension: function(ctx) {
        var ext = ctx.getExtension("WEBGL_draw_buffers");
        if (ext) {
            ctx["drawBuffers"] = function(n, bufs) {
                ext["drawBuffersWEBGL"](n, bufs)
            }
        }
    },
    initExtensions: function(context) {
        if (!context) context = GL.currentContext;
        if (context.initExtensionsDone) return;
        context.initExtensionsDone = true;
        var GLctx = context.GLctx;
        if (context.version < 2) {
            GL.acquireInstancedArraysExtension(GLctx);
            GL.acquireVertexArrayObjectExtension(GLctx);
            GL.acquireDrawBuffersExtension(GLctx)
        }
        GLctx.disjointTimerQueryExt = GLctx.getExtension("EXT_disjoint_timer_query");
        var automaticallyEnabledExtensions = ["OES_texture_float", "OES_texture_half_float", "OES_standard_derivatives", "OES_vertex_array_object", "WEBGL_compressed_texture_s3tc", "WEBGL_depth_texture", "OES_element_index_uint", "EXT_texture_filter_anisotropic", "EXT_frag_depth", "WEBGL_draw_buffers", "ANGLE_instanced_arrays", "OES_texture_float_linear", "OES_texture_half_float_linear", "EXT_blend_minmax", "EXT_shader_texture_lod", "WEBGL_compressed_texture_pvrtc", "EXT_color_buffer_half_float", "WEBGL_color_buffer_float", "EXT_sRGB", "WEBGL_compressed_texture_etc1", "EXT_disjoint_timer_query", "WEBGL_compressed_texture_etc", "WEBGL_compressed_texture_astc", "EXT_color_buffer_float", "WEBGL_compressed_texture_s3tc_srgb", "EXT_disjoint_timer_query_webgl2"];
        var exts = GLctx.getSupportedExtensions() || [];
        exts.forEach(function(ext) {
            if (automaticallyEnabledExtensions.indexOf(ext) != -1) {
                GLctx.getExtension(ext)
            }
        })
    },
    populateUniformTable: function(program) {
        var p = GL.programs[program];
        var ptable = GL.programInfos[program] = {
            uniforms: {},
            maxUniformLength: 0,
            maxAttributeLength: -1,
            maxUniformBlockNameLength: -1
        };
        var utable = ptable.uniforms;
        var numUniforms = GLctx.getProgramParameter(p, 35718);
        for (var i = 0; i < numUniforms; ++i) {
            var u = GLctx.getActiveUniform(p, i);
            var name = u.name;
            ptable.maxUniformLength = Math.max(ptable.maxUniformLength, name.length + 1);
            if (name.slice(-1) == "]") {
                name = name.slice(0, name.lastIndexOf("["))
            }
            var loc = GLctx.getUniformLocation(p, name);
            if (loc) {
                var id = GL.getNewId(GL.uniforms);
                utable[name] = [u.size, id];
                GL.uniforms[id] = loc;
                for (var j = 1; j < u.size; ++j) {
                    var n = name + "[" + j + "]";
                    loc = GLctx.getUniformLocation(p, n);
                    id = GL.getNewId(GL.uniforms);
                    GL.uniforms[id] = loc
                }
            }
        }
    }
};
var __emscripten_webgl_power_preferences = ["default", "low-power", "high-performance"];

function __findCanvasEventTarget(target) {
    if (typeof target === "number") target = UTF8ToString(target);
    if (!target || target === "#canvas") {
        if (typeof GL !== "undefined" && GL.offscreenCanvases["canvas"]) return GL.offscreenCanvases["canvas"];
        return Module["canvas"]
    }
    if (typeof GL !== "undefined" && GL.offscreenCanvases[target]) return GL.offscreenCanvases[target];
    return __findEventTarget(target)
}

function _emscripten_webgl_do_create_context(target, attributes) {
    var contextAttributes = {};
    var a = attributes >> 2;
    contextAttributes["alpha"] = !!HEAP32[a + (0 >> 2)];
    contextAttributes["depth"] = !!HEAP32[a + (4 >> 2)];
    contextAttributes["stencil"] = !!HEAP32[a + (8 >> 2)];
    contextAttributes["antialias"] = !!HEAP32[a + (12 >> 2)];
    contextAttributes["premultipliedAlpha"] = !!HEAP32[a + (16 >> 2)];
    contextAttributes["preserveDrawingBuffer"] = !!HEAP32[a + (20 >> 2)];
    var powerPreference = HEAP32[a + (24 >> 2)];
    contextAttributes["powerPreference"] = __emscripten_webgl_power_preferences[powerPreference];
    contextAttributes["failIfMajorPerformanceCaveat"] = !!HEAP32[a + (28 >> 2)];
    contextAttributes.majorVersion = HEAP32[a + (32 >> 2)];
    contextAttributes.minorVersion = HEAP32[a + (36 >> 2)];
    contextAttributes.enableExtensionsByDefault = HEAP32[a + (40 >> 2)];
    contextAttributes.explicitSwapControl = HEAP32[a + (44 >> 2)];
    contextAttributes.proxyContextToMainThread = HEAP32[a + (48 >> 2)];
    contextAttributes.renderViaOffscreenBackBuffer = HEAP32[a + (52 >> 2)];
    var canvas = __findCanvasEventTarget(target);
    if (!canvas) {
        return 0
    }
    if (contextAttributes.explicitSwapControl) {
        return 0
    }
    var contextHandle = GL.createContext(canvas, contextAttributes);
    return contextHandle
}

function _emscripten_webgl_create_context(a0, a1) {
    return _emscripten_webgl_do_create_context(a0, a1)
}

function _emscripten_webgl_destroy_context_calling_thread(contextHandle) {
    if (GL.currentContext == contextHandle) GL.currentContext = 0;
    GL.deleteContext(contextHandle)
}

function _emscripten_webgl_destroy_context(a0) {
    return _emscripten_webgl_destroy_context_calling_thread(a0)
}

function _emscripten_webgl_do_get_current_context() {
    return GL.currentContext ? GL.currentContext.handle : 0
}

function _emscripten_webgl_get_current_context() {
    return _emscripten_webgl_do_get_current_context()
}
Module["_emscripten_webgl_get_current_context"] = _emscripten_webgl_get_current_context;

function _emscripten_webgl_init_context_attributes(attributes) {
    var a = attributes >> 2;
    for (var i = 0; i < 56 >> 2; ++i) {
        HEAP32[a + i] = 0
    }
    HEAP32[a + (0 >> 2)] = HEAP32[a + (4 >> 2)] = HEAP32[a + (12 >> 2)] = HEAP32[a + (16 >> 2)] = HEAP32[a + (32 >> 2)] = HEAP32[a + (40 >> 2)] = 1
}

function _emscripten_webgl_make_context_current(contextHandle) {
    var success = GL.makeContextCurrent(contextHandle);
    return success ? 0 : -5
}
Module["_emscripten_webgl_make_context_current"] = _emscripten_webgl_make_context_current;

function _exit(status) {
    exit(status)
}

function _getenv(name) {
    if (name === 0) return 0;
    name = UTF8ToString(name);
    if (!ENV.hasOwnProperty(name)) return 0;
    if (_getenv.ret) _free(_getenv.ret);
    _getenv.ret = allocateUTF8(ENV[name]);
    return _getenv.ret
}

function _glActiveTexture(x0) {
    GLctx["activeTexture"](x0)
}

function _glAttachShader(program, shader) {
    GLctx.attachShader(GL.programs[program], GL.shaders[shader])
}

function _glBindAttribLocation(program, index, name) {
    GLctx.bindAttribLocation(GL.programs[program], index, UTF8ToString(name))
}

function _glBindBuffer(target, buffer) {
    GLctx.bindBuffer(target, GL.buffers[buffer])
}

function _glBindFramebuffer(target, framebuffer) {
    GLctx.bindFramebuffer(target, GL.framebuffers[framebuffer])
}

function _glBindRenderbuffer(target, renderbuffer) {
    GLctx.bindRenderbuffer(target, GL.renderbuffers[renderbuffer])
}

function _glBindTexture(target, texture) {
    GLctx.bindTexture(target, GL.textures[texture])
}

function _glBindVertexArray(vao) {
    GLctx["bindVertexArray"](GL.vaos[vao])
}

function _glBlendColor(x0, x1, x2, x3) {
    GLctx["blendColor"](x0, x1, x2, x3)
}

function _glBlendEquation(x0) {
    GLctx["blendEquation"](x0)
}

function _glBlendEquationSeparate(x0, x1) {
    GLctx["blendEquationSeparate"](x0, x1)
}

function _glBlendFunc(x0, x1) {
    GLctx["blendFunc"](x0, x1)
}

function _glBlendFuncSeparate(x0, x1, x2, x3) {
    GLctx["blendFuncSeparate"](x0, x1, x2, x3)
}

function _glBufferData(target, size, data, usage) {
    GLctx.bufferData(target, data ? HEAPU8.subarray(data, data + size) : size, usage)
}

function _glBufferSubData(target, offset, size, data) {
    GLctx.bufferSubData(target, offset, HEAPU8.subarray(data, data + size))
}

function _glCheckFramebufferStatus(x0) {
    return GLctx["checkFramebufferStatus"](x0)
}

function _glClear(x0) {
    GLctx["clear"](x0)
}

function _glClearColor(x0, x1, x2, x3) {
    GLctx["clearColor"](x0, x1, x2, x3)
}

function _glClearDepthf(x0) {
    GLctx["clearDepth"](x0)
}

function _glClearStencil(x0) {
    GLctx["clearStencil"](x0)
}

function _glColorMask(red, green, blue, alpha) {
    GLctx.colorMask(!!red, !!green, !!blue, !!alpha)
}

function _glCompileShader(shader) {
    GLctx.compileShader(GL.shaders[shader])
}

function _glCompressedTexImage2D(target, level, internalFormat, width, height, border, imageSize, data) {
    GLctx["compressedTexImage2D"](target, level, internalFormat, width, height, border, data ? HEAPU8.subarray(data, data + imageSize) : null)
}

function _glCompressedTexSubImage2D(target, level, xoffset, yoffset, width, height, format, imageSize, data) {
    GLctx["compressedTexSubImage2D"](target, level, xoffset, yoffset, width, height, format, data ? HEAPU8.subarray(data, data + imageSize) : null)
}

function _glCreateProgram() {
    var id = GL.getNewId(GL.programs);
    var program = GLctx.createProgram();
    program.name = id;
    GL.programs[id] = program;
    return id
}

function _glCreateShader(shaderType) {
    var id = GL.getNewId(GL.shaders);
    GL.shaders[id] = GLctx.createShader(shaderType);
    return id
}

function _glCullFace(x0) {
    GLctx["cullFace"](x0)
}

function _glDeleteBuffers(n, buffers) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[buffers + i * 4 >> 2];
        var buffer = GL.buffers[id];
        if (!buffer) continue;
        GLctx.deleteBuffer(buffer);
        buffer.name = 0;
        GL.buffers[id] = null;
        if (id == GL.currArrayBuffer) GL.currArrayBuffer = 0;
        if (id == GL.currElementArrayBuffer) GL.currElementArrayBuffer = 0
    }
}

function _glDeleteFramebuffers(n, framebuffers) {
    for (var i = 0; i < n; ++i) {
        var id = HEAP32[framebuffers + i * 4 >> 2];
        var framebuffer = GL.framebuffers[id];
        if (!framebuffer) continue;
        GLctx.deleteFramebuffer(framebuffer);
        framebuffer.name = 0;
        GL.framebuffers[id] = null
    }
}

function _glDeleteProgram(id) {
    if (!id) return;
    var program = GL.programs[id];
    if (!program) {
        GL.recordError(1281);
        return
    }
    GLctx.deleteProgram(program);
    program.name = 0;
    GL.programs[id] = null;
    GL.programInfos[id] = null
}

function _glDeleteRenderbuffers(n, renderbuffers) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[renderbuffers + i * 4 >> 2];
        var renderbuffer = GL.renderbuffers[id];
        if (!renderbuffer) continue;
        GLctx.deleteRenderbuffer(renderbuffer);
        renderbuffer.name = 0;
        GL.renderbuffers[id] = null
    }
}

function _glDeleteShader(id) {
    if (!id) return;
    var shader = GL.shaders[id];
    if (!shader) {
        GL.recordError(1281);
        return
    }
    GLctx.deleteShader(shader);
    GL.shaders[id] = null
}

function _glDeleteTextures(n, textures) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[textures + i * 4 >> 2];
        var texture = GL.textures[id];
        if (!texture) continue;
        GLctx.deleteTexture(texture);
        texture.name = 0;
        GL.textures[id] = null
    }
}

function _glDeleteVertexArrays(n, vaos) {
    for (var i = 0; i < n; i++) {
        var id = HEAP32[vaos + i * 4 >> 2];
        GLctx["deleteVertexArray"](GL.vaos[id]);
        GL.vaos[id] = null
    }
}

function _glDepthFunc(x0) {
    GLctx["depthFunc"](x0)
}

function _glDepthMask(flag) {
    GLctx.depthMask(!!flag)
}

function _glDepthRangef(x0, x1) {
    GLctx["depthRange"](x0, x1)
}

function _glDetachShader(program, shader) {
    GLctx.detachShader(GL.programs[program], GL.shaders[shader])
}

function _glDisable(x0) {
    GLctx["disable"](x0)
}

function _glDisableVertexAttribArray(index) {
    GLctx.disableVertexAttribArray(index)
}

function _glDrawArrays(mode, first, count) {
    GLctx.drawArrays(mode, first, count)
}

function _glDrawElements(mode, count, type, indices) {
    GLctx.drawElements(mode, count, type, indices)
}

function _glEnable(x0) {
    GLctx["enable"](x0)
}

function _glEnableVertexAttribArray(index) {
    GLctx.enableVertexAttribArray(index)
}

function _glFinish() {
    GLctx["finish"]()
}

function _glFlush() {
    GLctx["flush"]()
}

function _glFramebufferRenderbuffer(target, attachment, renderbuffertarget, renderbuffer) {
    GLctx.framebufferRenderbuffer(target, attachment, renderbuffertarget, GL.renderbuffers[renderbuffer])
}

function _glFramebufferTexture2D(target, attachment, textarget, texture, level) {
    GLctx.framebufferTexture2D(target, attachment, textarget, GL.textures[texture], level)
}

function _glFrontFace(x0) {
    GLctx["frontFace"](x0)
}

function __glGenObject(n, buffers, createFunction, objectTable) {
    for (var i = 0; i < n; i++) {
        var buffer = GLctx[createFunction]();
        var id = buffer && GL.getNewId(objectTable);
        if (buffer) {
            buffer.name = id;
            objectTable[id] = buffer
        } else {
            GL.recordError(1282)
        }
        HEAP32[buffers + i * 4 >> 2] = id
    }
}

function _glGenBuffers(n, buffers) {
    __glGenObject(n, buffers, "createBuffer", GL.buffers)
}

function _glGenFramebuffers(n, ids) {
    __glGenObject(n, ids, "createFramebuffer", GL.framebuffers)
}

function _glGenRenderbuffers(n, renderbuffers) {
    __glGenObject(n, renderbuffers, "createRenderbuffer", GL.renderbuffers)
}

function _glGenTextures(n, textures) {
    __glGenObject(n, textures, "createTexture", GL.textures)
}

function _glGenVertexArrays(n, arrays) {
    __glGenObject(n, arrays, "createVertexArray", GL.vaos)
}

function _glGenerateMipmap(x0) {
    GLctx["generateMipmap"](x0)
}

function _glGetAttribLocation(program, name) {
    return GLctx.getAttribLocation(GL.programs[program], UTF8ToString(name))
}

function emscriptenWebGLGet(name_, p, type) {
    if (!p) {
        GL.recordError(1281);
        return
    }
    var ret = undefined;
    switch (name_) {
        case 36346:
            ret = 1;
            break;
        case 36344:
            if (type != 0 && type != 1) {
                GL.recordError(1280)
            }
            return;
        case 36345:
            ret = 0;
            break;
        case 34466:
            var formats = GLctx.getParameter(34467);
            ret = formats ? formats.length : 0;
            break
    }
    if (ret === undefined) {
        var result = GLctx.getParameter(name_);
        switch (typeof result) {
            case "number":
                ret = result;
                break;
            case "boolean":
                ret = result ? 1 : 0;
                break;
            case "string":
                GL.recordError(1280);
                return;
            case "object":
                if (result === null) {
                    switch (name_) {
                        case 34964:
                        case 35725:
                        case 34965:
                        case 36006:
                        case 36007:
                        case 32873:
                        case 34229:
                        case 34068:
                            {
                                ret = 0;
                                break
                            }
                        default:
                            {
                                GL.recordError(1280);
                                return
                            }
                    }
                } else if (result instanceof Float32Array || result instanceof Uint32Array || result instanceof Int32Array || result instanceof Array) {
                    for (var i = 0; i < result.length; ++i) {
                        switch (type) {
                            case 0:
                                HEAP32[p + i * 4 >> 2] = result[i];
                                break;
                            case 2:
                                HEAPF32[p + i * 4 >> 2] = result[i];
                                break;
                            case 4:
                                HEAP8[p + i >> 0] = result[i] ? 1 : 0;
                                break
                        }
                    }
                    return
                } else {
                    try {
                        ret = result.name | 0
                    } catch (e) {
                        GL.recordError(1280);
                        err("GL_INVALID_ENUM in glGet" + type + "v: Unknown object returned from WebGL getParameter(" + name_ + ")! (error: " + e + ")");
                        return
                    }
                }
                break;
            default:
                GL.recordError(1280);
                err("GL_INVALID_ENUM in glGet" + type + "v: Native code calling glGet" + type + "v(" + name_ + ") and it returns " + result + " of type " + typeof result + "!");
                return
        }
    }
    switch (type) {
        case 1:
            tempI64 = [ret >>> 0, (tempDouble = ret, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math_min(+Math_floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[p >> 2] = tempI64[0], HEAP32[p + 4 >> 2] = tempI64[1];
            break;
        case 0:
            HEAP32[p >> 2] = ret;
            break;
        case 2:
            HEAPF32[p >> 2] = ret;
            break;
        case 4:
            HEAP8[p >> 0] = ret ? 1 : 0;
            break
    }
}

function _glGetBooleanv(name_, p) {
    emscriptenWebGLGet(name_, p, 4)
}

function _glGetError() {
    var error = GLctx.getError() || GL.lastError;
    GL.lastError = 0;
    return error
}

function _glGetFloatv(name_, p) {
    emscriptenWebGLGet(name_, p, 2)
}

function _glGetIntegerv(name_, p) {
    emscriptenWebGLGet(name_, p, 0)
}

function _glGetProgramInfoLog(program, maxLength, length, infoLog) {
    var log = GLctx.getProgramInfoLog(GL.programs[program]);
    if (log === null) log = "(unknown error)";
    var numBytesWrittenExclNull = maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
    if (length) HEAP32[length >> 2] = numBytesWrittenExclNull
}

function _glGetProgramiv(program, pname, p) {
    if (!p) {
        GL.recordError(1281);
        return
    }
    if (program >= GL.counter) {
        GL.recordError(1281);
        return
    }
    var ptable = GL.programInfos[program];
    if (!ptable) {
        GL.recordError(1282);
        return
    }
    if (pname == 35716) {
        var log = GLctx.getProgramInfoLog(GL.programs[program]);
        if (log === null) log = "(unknown error)";
        HEAP32[p >> 2] = log.length + 1
    } else if (pname == 35719) {
        HEAP32[p >> 2] = ptable.maxUniformLength
    } else if (pname == 35722) {
        if (ptable.maxAttributeLength == -1) {
            program = GL.programs[program];
            var numAttribs = GLctx.getProgramParameter(program, 35721);
            ptable.maxAttributeLength = 0;
            for (var i = 0; i < numAttribs; ++i) {
                var activeAttrib = GLctx.getActiveAttrib(program, i);
                ptable.maxAttributeLength = Math.max(ptable.maxAttributeLength, activeAttrib.name.length + 1)
            }
        }
        HEAP32[p >> 2] = ptable.maxAttributeLength
    } else if (pname == 35381) {
        if (ptable.maxUniformBlockNameLength == -1) {
            program = GL.programs[program];
            var numBlocks = GLctx.getProgramParameter(program, 35382);
            ptable.maxUniformBlockNameLength = 0;
            for (var i = 0; i < numBlocks; ++i) {
                var activeBlockName = GLctx.getActiveUniformBlockName(program, i);
                ptable.maxUniformBlockNameLength = Math.max(ptable.maxUniformBlockNameLength, activeBlockName.length + 1)
            }
        }
        HEAP32[p >> 2] = ptable.maxUniformBlockNameLength
    } else {
        HEAP32[p >> 2] = GLctx.getProgramParameter(GL.programs[program], pname)
    }
}

function _glGetShaderInfoLog(shader, maxLength, length, infoLog) {
    var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
    if (log === null) log = "(unknown error)";
    var numBytesWrittenExclNull = maxLength > 0 && infoLog ? stringToUTF8(log, infoLog, maxLength) : 0;
    if (length) HEAP32[length >> 2] = numBytesWrittenExclNull
}

function _glGetShaderiv(shader, pname, p) {
    if (!p) {
        GL.recordError(1281);
        return
    }
    if (pname == 35716) {
        var log = GLctx.getShaderInfoLog(GL.shaders[shader]);
        if (log === null) log = "(unknown error)";
        HEAP32[p >> 2] = log.length + 1
    } else if (pname == 35720) {
        var source = GLctx.getShaderSource(GL.shaders[shader]);
        var sourceLength = source === null || source.length == 0 ? 0 : source.length + 1;
        HEAP32[p >> 2] = sourceLength
    } else {
        HEAP32[p >> 2] = GLctx.getShaderParameter(GL.shaders[shader], pname)
    }
}

function stringToNewUTF8(jsString) {
    var length = lengthBytesUTF8(jsString) + 1;
    var cString = _malloc(length);
    stringToUTF8(jsString, cString, length);
    return cString
}

function _glGetString(name_) {
    if (GL.stringCache[name_]) return GL.stringCache[name_];
    var ret;
    switch (name_) {
        case 7939:
            var exts = GLctx.getSupportedExtensions() || [];
            exts = exts.concat(exts.map(function(e) {
                return "GL_" + e
            }));
            ret = stringToNewUTF8(exts.join(" "));
            break;
        case 7936:
        case 7937:
        case 37445:
        case 37446:
            var s = GLctx.getParameter(name_);
            if (!s) {
                GL.recordError(1280)
            }
            ret = stringToNewUTF8(s);
            break;
        case 7938:
            var glVersion = GLctx.getParameter(GLctx.VERSION); {
                glVersion = "OpenGL ES 2.0 (" + glVersion + ")"
            }
            ret = stringToNewUTF8(glVersion);
            break;
        case 35724:
            var glslVersion = GLctx.getParameter(GLctx.SHADING_LANGUAGE_VERSION);
            var ver_re = /^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;
            var ver_num = glslVersion.match(ver_re);
            if (ver_num !== null) {
                if (ver_num[1].length == 3) ver_num[1] = ver_num[1] + "0";
                glslVersion = "OpenGL ES GLSL ES " + ver_num[1] + " (" + glslVersion + ")"
            }
            ret = stringToNewUTF8(glslVersion);
            break;
        default:
            GL.recordError(1280);
            return 0
    }
    GL.stringCache[name_] = ret;
    return ret
}

function _glGetUniformLocation(program, name) {
    name = UTF8ToString(name);
    var arrayIndex = 0;
    if (name[name.length - 1] == "]") {
        var leftBrace = name.lastIndexOf("[");
        arrayIndex = name[leftBrace + 1] != "]" ? parseInt(name.slice(leftBrace + 1)) : 0;
        name = name.slice(0, leftBrace)
    }
    var uniformInfo = GL.programInfos[program] && GL.programInfos[program].uniforms[name];
    if (uniformInfo && arrayIndex >= 0 && arrayIndex < uniformInfo[0]) {
        return uniformInfo[1] + arrayIndex
    } else {
        return -1
    }
}

function _glHint(x0, x1) {
    GLctx["hint"](x0, x1)
}

function _glIsBuffer(buffer) {
    var b = GL.buffers[buffer];
    if (!b) return 0;
    return GLctx.isBuffer(b)
}

function _glIsFramebuffer(framebuffer) {
    var fb = GL.framebuffers[framebuffer];
    if (!fb) return 0;
    return GLctx.isFramebuffer(fb)
}

function _glIsProgram(program) {
    program = GL.programs[program];
    if (!program) return 0;
    return GLctx.isProgram(program)
}

function _glIsRenderbuffer(renderbuffer) {
    var rb = GL.renderbuffers[renderbuffer];
    if (!rb) return 0;
    return GLctx.isRenderbuffer(rb)
}

function _glIsShader(shader) {
    var s = GL.shaders[shader];
    if (!s) return 0;
    return GLctx.isShader(s)
}

function _glIsTexture(id) {
    var texture = GL.textures[id];
    if (!texture) return 0;
    return GLctx.isTexture(texture)
}

function _glIsVertexArray(array) {
    var vao = GL.vaos[array];
    if (!vao) return 0;
    return GLctx["isVertexArray"](vao)
}

function _glLinkProgram(program) {
    GLctx.linkProgram(GL.programs[program]);
    GL.populateUniformTable(program)
}

function _glPixelStorei(pname, param) {
    if (pname == 3317) {
        GL.unpackAlignment = param
    }
    GLctx.pixelStorei(pname, param)
}

function _glPolygonOffset(x0, x1) {
    GLctx["polygonOffset"](x0, x1)
}

function __computeUnpackAlignedImageSize(width, height, sizePerPixel, alignment) {
    function roundedToNextMultipleOf(x, y) {
        return x + y - 1 & -y
    }
    var plainRowSize = width * sizePerPixel;
    var alignedRowSize = roundedToNextMultipleOf(plainRowSize, alignment);
    return height * alignedRowSize
}
var __colorChannelsInGlTextureFormat = {
    6402: 1,
    6406: 1,
    6407: 3,
    6408: 4,
    6409: 1,
    6410: 2,
    35904: 3,
    35906: 4
};
var __sizeOfGlTextureElementType = {
    5121: 1,
    5123: 2,
    5125: 4,
    5126: 4,
    32819: 2,
    32820: 2,
    33635: 2,
    34042: 4,
    36193: 2
};

function emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) {
    var sizePerPixel = __colorChannelsInGlTextureFormat[format] * __sizeOfGlTextureElementType[type];
    if (!sizePerPixel) {
        GL.recordError(1280);
        return
    }
    var bytes = __computeUnpackAlignedImageSize(width, height, sizePerPixel, GL.unpackAlignment);
    var end = pixels + bytes;
    switch (type) {
        case 5121:
            return HEAPU8.subarray(pixels, end);
        case 5126:
            return HEAPF32.subarray(pixels >> 2, end >> 2);
        case 5125:
        case 34042:
            return HEAPU32.subarray(pixels >> 2, end >> 2);
        case 5123:
        case 33635:
        case 32819:
        case 32820:
        case 36193:
            return HEAPU16.subarray(pixels >> 1, end >> 1);
        default:
            GL.recordError(1280)
    }
}

function _glReadPixels(x, y, width, height, format, type, pixels) {
    var pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, format);
    if (!pixelData) {
        GL.recordError(1280);
        return
    }
    GLctx.readPixels(x, y, width, height, format, type, pixelData)
}

function _glRenderbufferStorage(x0, x1, x2, x3) {
    GLctx["renderbufferStorage"](x0, x1, x2, x3)
}

function _glScissor(x0, x1, x2, x3) {
    GLctx["scissor"](x0, x1, x2, x3)
}

function _glShaderBinary() {
    GL.recordError(1280)
}

function _glShaderSource(shader, count, string, length) {
    var source = GL.getSource(shader, count, string, length);
    GLctx.shaderSource(GL.shaders[shader], source)
}

function _glStencilFunc(x0, x1, x2) {
    GLctx["stencilFunc"](x0, x1, x2)
}

function _glStencilFuncSeparate(x0, x1, x2, x3) {
    GLctx["stencilFuncSeparate"](x0, x1, x2, x3)
}

function _glStencilMask(x0) {
    GLctx["stencilMask"](x0)
}

function _glStencilMaskSeparate(x0, x1) {
    GLctx["stencilMaskSeparate"](x0, x1)
}

function _glStencilOp(x0, x1, x2) {
    GLctx["stencilOp"](x0, x1, x2)
}

function _glStencilOpSeparate(x0, x1, x2, x3) {
    GLctx["stencilOpSeparate"](x0, x1, x2, x3)
}

function _glTexImage2D(target, level, internalFormat, width, height, border, format, type, pixels) {
    GLctx.texImage2D(target, level, internalFormat, width, height, border, format, type, pixels ? emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, internalFormat) : null)
}

function _glTexParameterf(x0, x1, x2) {
    GLctx["texParameterf"](x0, x1, x2)
}

function _glTexParameterfv(target, pname, params) {
    var param = HEAPF32[params >> 2];
    GLctx.texParameterf(target, pname, param)
}

function _glTexParameteri(x0, x1, x2) {
    GLctx["texParameteri"](x0, x1, x2)
}

function _glTexParameteriv(target, pname, params) {
    var param = HEAP32[params >> 2];
    GLctx.texParameteri(target, pname, param)
}

function _glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels) {
    var pixelData = null;
    if (pixels) pixelData = emscriptenWebGLGetTexPixelData(type, format, width, height, pixels, 0);
    GLctx.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixelData)
}

function _glUniform1f(location, v0) {
    GLctx.uniform1f(GL.uniforms[location], v0)
}

function _glUniform1fv(location, count, value) {
    if (count <= GL.MINI_TEMP_BUFFER_SIZE) {
        var view = GL.miniTempBufferViews[count - 1];
        for (var i = 0; i < count; ++i) {
            view[i] = HEAPF32[value + 4 * i >> 2]
        }
    } else {
        var view = HEAPF32.subarray(value >> 2, value + count * 4 >> 2)
    }
    GLctx.uniform1fv(GL.uniforms[location], view)
}

function _glUniform1i(location, v0) {
    GLctx.uniform1i(GL.uniforms[location], v0)
}

function _glUniform1iv(location, count, value) {
    GLctx.uniform1iv(GL.uniforms[location], HEAP32.subarray(value >> 2, value + count * 4 >> 2))
}

function _glUniform2f(location, v0, v1) {
    GLctx.uniform2f(GL.uniforms[location], v0, v1)
}

function _glUniform2fv(location, count, value) {
    if (2 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
        var view = GL.miniTempBufferViews[2 * count - 1];
        for (var i = 0; i < 2 * count; i += 2) {
            view[i] = HEAPF32[value + 4 * i >> 2];
            view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2]
        }
    } else {
        var view = HEAPF32.subarray(value >> 2, value + count * 8 >> 2)
    }
    GLctx.uniform2fv(GL.uniforms[location], view)
}

function _glUniform2i(location, v0, v1) {
    GLctx.uniform2i(GL.uniforms[location], v0, v1)
}

function _glUniform2iv(location, count, value) {
    GLctx.uniform2iv(GL.uniforms[location], HEAP32.subarray(value >> 2, value + count * 8 >> 2))
}

function _glUniform3f(location, v0, v1, v2) {
    GLctx.uniform3f(GL.uniforms[location], v0, v1, v2)
}

function _glUniform3fv(location, count, value) {
    if (3 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
        var view = GL.miniTempBufferViews[3 * count - 1];
        for (var i = 0; i < 3 * count; i += 3) {
            view[i] = HEAPF32[value + 4 * i >> 2];
            view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
            view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2]
        }
    } else {
        var view = HEAPF32.subarray(value >> 2, value + count * 12 >> 2)
    }
    GLctx.uniform3fv(GL.uniforms[location], view)
}

function _glUniform3i(location, v0, v1, v2) {
    GLctx.uniform3i(GL.uniforms[location], v0, v1, v2)
}

function _glUniform3iv(location, count, value) {
    GLctx.uniform3iv(GL.uniforms[location], HEAP32.subarray(value >> 2, value + count * 12 >> 2))
}

function _glUniform4f(location, v0, v1, v2, v3) {
    GLctx.uniform4f(GL.uniforms[location], v0, v1, v2, v3)
}

function _glUniform4fv(location, count, value) {
    if (4 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
        var view = GL.miniTempBufferViews[4 * count - 1];
        for (var i = 0; i < 4 * count; i += 4) {
            view[i] = HEAPF32[value + 4 * i >> 2];
            view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
            view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
            view[i + 3] = HEAPF32[value + (4 * i + 12) >> 2]
        }
    } else {
        var view = HEAPF32.subarray(value >> 2, value + count * 16 >> 2)
    }
    GLctx.uniform4fv(GL.uniforms[location], view)
}

function _glUniform4i(location, v0, v1, v2, v3) {
    GLctx.uniform4i(GL.uniforms[location], v0, v1, v2, v3)
}

function _glUniform4iv(location, count, value) {
    GLctx.uniform4iv(GL.uniforms[location], HEAP32.subarray(value >> 2, value + count * 16 >> 2))
}

function _glUniformMatrix2fv(location, count, transpose, value) {
    if (4 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
        var view = GL.miniTempBufferViews[4 * count - 1];
        for (var i = 0; i < 4 * count; i += 4) {
            view[i] = HEAPF32[value + 4 * i >> 2];
            view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
            view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
            view[i + 3] = HEAPF32[value + (4 * i + 12) >> 2]
        }
    } else {
        var view = HEAPF32.subarray(value >> 2, value + count * 16 >> 2)
    }
    GLctx.uniformMatrix2fv(GL.uniforms[location], !!transpose, view)
}

function _glUniformMatrix3fv(location, count, transpose, value) {
    if (9 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
        var view = GL.miniTempBufferViews[9 * count - 1];
        for (var i = 0; i < 9 * count; i += 9) {
            view[i] = HEAPF32[value + 4 * i >> 2];
            view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
            view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
            view[i + 3] = HEAPF32[value + (4 * i + 12) >> 2];
            view[i + 4] = HEAPF32[value + (4 * i + 16) >> 2];
            view[i + 5] = HEAPF32[value + (4 * i + 20) >> 2];
            view[i + 6] = HEAPF32[value + (4 * i + 24) >> 2];
            view[i + 7] = HEAPF32[value + (4 * i + 28) >> 2];
            view[i + 8] = HEAPF32[value + (4 * i + 32) >> 2]
        }
    } else {
        var view = HEAPF32.subarray(value >> 2, value + count * 36 >> 2)
    }
    GLctx.uniformMatrix3fv(GL.uniforms[location], !!transpose, view)
}

function _glUniformMatrix4fv(location, count, transpose, value) {
    if (16 * count <= GL.MINI_TEMP_BUFFER_SIZE) {
        var view = GL.miniTempBufferViews[16 * count - 1];
        for (var i = 0; i < 16 * count; i += 16) {
            view[i] = HEAPF32[value + 4 * i >> 2];
            view[i + 1] = HEAPF32[value + (4 * i + 4) >> 2];
            view[i + 2] = HEAPF32[value + (4 * i + 8) >> 2];
            view[i + 3] = HEAPF32[value + (4 * i + 12) >> 2];
            view[i + 4] = HEAPF32[value + (4 * i + 16) >> 2];
            view[i + 5] = HEAPF32[value + (4 * i + 20) >> 2];
            view[i + 6] = HEAPF32[value + (4 * i + 24) >> 2];
            view[i + 7] = HEAPF32[value + (4 * i + 28) >> 2];
            view[i + 8] = HEAPF32[value + (4 * i + 32) >> 2];
            view[i + 9] = HEAPF32[value + (4 * i + 36) >> 2];
            view[i + 10] = HEAPF32[value + (4 * i + 40) >> 2];
            view[i + 11] = HEAPF32[value + (4 * i + 44) >> 2];
            view[i + 12] = HEAPF32[value + (4 * i + 48) >> 2];
            view[i + 13] = HEAPF32[value + (4 * i + 52) >> 2];
            view[i + 14] = HEAPF32[value + (4 * i + 56) >> 2];
            view[i + 15] = HEAPF32[value + (4 * i + 60) >> 2]
        }
    } else {
        var view = HEAPF32.subarray(value >> 2, value + count * 64 >> 2)
    }
    GLctx.uniformMatrix4fv(GL.uniforms[location], !!transpose, view)
}

function _glUseProgram(program) {
    GLctx.useProgram(GL.programs[program])
}

function _glValidateProgram(program) {
    GLctx.validateProgram(GL.programs[program])
}

function _glVertexAttribPointer(index, size, type, normalized, stride, ptr) {
    GLctx.vertexAttribPointer(index, size, type, !!normalized, stride, ptr)
}

function _glViewport(x0, x1, x2, x3) {
    GLctx["viewport"](x0, x1, x2, x3)
}
var ___tm_current = 6635216;
var ___tm_timezone = (stringToUTF8("GMT", 6635264, 4), 6635264);

function _gmtime_r(time, tmPtr) {
    var date = new Date(HEAP32[time >> 2] * 1e3);
    HEAP32[tmPtr >> 2] = date.getUTCSeconds();
    HEAP32[tmPtr + 4 >> 2] = date.getUTCMinutes();
    HEAP32[tmPtr + 8 >> 2] = date.getUTCHours();
    HEAP32[tmPtr + 12 >> 2] = date.getUTCDate();
    HEAP32[tmPtr + 16 >> 2] = date.getUTCMonth();
    HEAP32[tmPtr + 20 >> 2] = date.getUTCFullYear() - 1900;
    HEAP32[tmPtr + 24 >> 2] = date.getUTCDay();
    HEAP32[tmPtr + 36 >> 2] = 0;
    HEAP32[tmPtr + 32 >> 2] = 0;
    var start = Date.UTC(date.getUTCFullYear(), 0, 1, 0, 0, 0, 0);
    var yday = (date.getTime() - start) / (1e3 * 60 * 60 * 24) | 0;
    HEAP32[tmPtr + 28 >> 2] = yday;
    HEAP32[tmPtr + 40 >> 2] = ___tm_timezone;
    return tmPtr
}

function _gmtime(time) {
    return _gmtime_r(time, ___tm_current)
}

function _llvm_exp2_f32(x) {
    return Math.pow(2, x)
}

function _llvm_exp2_f64(a0) {
    return _llvm_exp2_f32(a0)
}

function _llvm_log10_f32(x) {
    return Math.log(x) / Math.LN10
}

function _llvm_log10_f64(a0) {
    return _llvm_log10_f32(a0)
}

function _llvm_log2_f32(x) {
    return Math.log(x) / Math.LN2
}

function _llvm_log2_f64(a0) {
    return _llvm_log2_f32(a0)
}

function _llvm_stackrestore(p) {
    var self = _llvm_stacksave;
    var ret = self.LLVM_SAVEDSTACKS[p];
    self.LLVM_SAVEDSTACKS.splice(p, 1);
    stackRestore(ret)
}

function _llvm_stacksave() {
    var self = _llvm_stacksave;
    if (!self.LLVM_SAVEDSTACKS) {
        self.LLVM_SAVEDSTACKS = []
    }
    self.LLVM_SAVEDSTACKS.push(stackSave());
    return self.LLVM_SAVEDSTACKS.length - 1
}

function _llvm_trap() {
    abort("trap!")
}

function _tzset() {
    if (_tzset.called) return;
    _tzset.called = true;
    HEAP32[__get_timezone() >> 2] = (new Date).getTimezoneOffset() * 60;
    var currentYear = (new Date).getFullYear();
    var winter = new Date(currentYear, 0, 1);
    var summer = new Date(currentYear, 6, 1);
    HEAP32[__get_daylight() >> 2] = Number(winter.getTimezoneOffset() != summer.getTimezoneOffset());

    function extractZone(date) {
        var match = date.toTimeString().match(/\(([A-Za-z ]+)\)$/);
        return match ? match[1] : "GMT"
    }
    var winterName = extractZone(winter);
    var summerName = extractZone(summer);
    var winterNamePtr = allocate(intArrayFromString(winterName), "i8", ALLOC_NORMAL);
    var summerNamePtr = allocate(intArrayFromString(summerName), "i8", ALLOC_NORMAL);
    if (summer.getTimezoneOffset() < winter.getTimezoneOffset()) {
        HEAP32[__get_tzname() >> 2] = winterNamePtr;
        HEAP32[__get_tzname() + 4 >> 2] = summerNamePtr
    } else {
        HEAP32[__get_tzname() >> 2] = summerNamePtr;
        HEAP32[__get_tzname() + 4 >> 2] = winterNamePtr
    }
}

function _localtime_r(time, tmPtr) {
    _tzset();
    var date = new Date(HEAP32[time >> 2] * 1e3);
    HEAP32[tmPtr >> 2] = date.getSeconds();
    HEAP32[tmPtr + 4 >> 2] = date.getMinutes();
    HEAP32[tmPtr + 8 >> 2] = date.getHours();
    HEAP32[tmPtr + 12 >> 2] = date.getDate();
    HEAP32[tmPtr + 16 >> 2] = date.getMonth();
    HEAP32[tmPtr + 20 >> 2] = date.getFullYear() - 1900;
    HEAP32[tmPtr + 24 >> 2] = date.getDay();
    var start = new Date(date.getFullYear(), 0, 1);
    var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
    HEAP32[tmPtr + 28 >> 2] = yday;
    HEAP32[tmPtr + 36 >> 2] = -(date.getTimezoneOffset() * 60);
    var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    var winterOffset = start.getTimezoneOffset();
    var dst = (summerOffset != winterOffset && date.getTimezoneOffset() == Math.min(winterOffset, summerOffset)) | 0;
    HEAP32[tmPtr + 32 >> 2] = dst;
    var zonePtr = HEAP32[__get_tzname() + (dst ? 4 : 0) >> 2];
    HEAP32[tmPtr + 40 >> 2] = zonePtr;
    return tmPtr
}

function _localtime(time) {
    return _localtime_r(time, ___tm_current)
}

function _emscripten_memcpy_big(dest, src, num) {
    HEAPU8.set(HEAPU8.subarray(src, src + num), dest)
}

function _mktime(tmPtr) {
    _tzset();
    var date = new Date(HEAP32[tmPtr + 20 >> 2] + 1900, HEAP32[tmPtr + 16 >> 2], HEAP32[tmPtr + 12 >> 2], HEAP32[tmPtr + 8 >> 2], HEAP32[tmPtr + 4 >> 2], HEAP32[tmPtr >> 2], 0);
    var dst = HEAP32[tmPtr + 32 >> 2];
    var guessedOffset = date.getTimezoneOffset();
    var start = new Date(date.getFullYear(), 0, 1);
    var summerOffset = new Date(date.getFullYear(), 6, 1).getTimezoneOffset();
    var winterOffset = start.getTimezoneOffset();
    var dstOffset = Math.min(winterOffset, summerOffset);
    if (dst < 0) {
        HEAP32[tmPtr + 32 >> 2] = Number(summerOffset != winterOffset && dstOffset == guessedOffset)
    } else if (dst > 0 != (dstOffset == guessedOffset)) {
        var nonDstOffset = Math.max(winterOffset, summerOffset);
        var trueOffset = dst > 0 ? dstOffset : nonDstOffset;
        date.setTime(date.getTime() + (trueOffset - guessedOffset) * 6e4)
    }
    HEAP32[tmPtr + 24 >> 2] = date.getDay();
    var yday = (date.getTime() - start.getTime()) / (1e3 * 60 * 60 * 24) | 0;
    HEAP32[tmPtr + 28 >> 2] = yday;
    return date.getTime() / 1e3 | 0
}

function _pthread_cond_destroy() {
    return 0
}

function _pthread_create() {
    return 6
}

function _pthread_join() {}

function _pthread_mutexattr_destroy() {}

function _pthread_mutexattr_init() {}

function _pthread_mutexattr_settype() {}

function _sched_yield() {
    return 0
}

function __isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
}

function __arraySum(array, index) {
    var sum = 0;
    for (var i = 0; i <= index; sum += array[i++]);
    return sum
}
var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function __addDays(date, days) {
    var newDate = new Date(date.getTime());
    while (days > 0) {
        var leap = __isLeapYear(newDate.getFullYear());
        var currentMonth = newDate.getMonth();
        var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
        if (days > daysInCurrentMonth - newDate.getDate()) {
            days -= daysInCurrentMonth - newDate.getDate() + 1;
            newDate.setDate(1);
            if (currentMonth < 11) {
                newDate.setMonth(currentMonth + 1)
            } else {
                newDate.setMonth(0);
                newDate.setFullYear(newDate.getFullYear() + 1)
            }
        } else {
            newDate.setDate(newDate.getDate() + days);
            return newDate
        }
    }
    return newDate
}

function _strftime(s, maxsize, format, tm) {
    var tm_zone = HEAP32[tm + 40 >> 2];
    var date = {
        tm_sec: HEAP32[tm >> 2],
        tm_min: HEAP32[tm + 4 >> 2],
        tm_hour: HEAP32[tm + 8 >> 2],
        tm_mday: HEAP32[tm + 12 >> 2],
        tm_mon: HEAP32[tm + 16 >> 2],
        tm_year: HEAP32[tm + 20 >> 2],
        tm_wday: HEAP32[tm + 24 >> 2],
        tm_yday: HEAP32[tm + 28 >> 2],
        tm_isdst: HEAP32[tm + 32 >> 2],
        tm_gmtoff: HEAP32[tm + 36 >> 2],
        tm_zone: tm_zone ? UTF8ToString(tm_zone) : ""
    };
    var pattern = UTF8ToString(format);
    var EXPANSION_RULES_1 = {
        "%c": "%a %b %d %H:%M:%S %Y",
        "%D": "%m/%d/%y",
        "%F": "%Y-%m-%d",
        "%h": "%b",
        "%r": "%I:%M:%S %p",
        "%R": "%H:%M",
        "%T": "%H:%M:%S",
        "%x": "%m/%d/%y",
        "%X": "%H:%M:%S",
        "%Ec": "%c",
        "%EC": "%C",
        "%Ex": "%m/%d/%y",
        "%EX": "%H:%M:%S",
        "%Ey": "%y",
        "%EY": "%Y",
        "%Od": "%d",
        "%Oe": "%e",
        "%OH": "%H",
        "%OI": "%I",
        "%Om": "%m",
        "%OM": "%M",
        "%OS": "%S",
        "%Ou": "%u",
        "%OU": "%U",
        "%OV": "%V",
        "%Ow": "%w",
        "%OW": "%W",
        "%Oy": "%y"
    };
    for (var rule in EXPANSION_RULES_1) {
        pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule])
    }
    var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    function leadingSomething(value, digits, character) {
        var str = typeof value === "number" ? value.toString() : value || "";
        while (str.length < digits) {
            str = character[0] + str
        }
        return str
    }

    function leadingNulls(value, digits) {
        return leadingSomething(value, digits, "0")
    }

    function compareByDay(date1, date2) {
        function sgn(value) {
            return value < 0 ? -1 : value > 0 ? 1 : 0
        }
        var compare;
        if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
            if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
                compare = sgn(date1.getDate() - date2.getDate())
            }
        }
        return compare
    }

    function getFirstWeekStartDate(janFourth) {
        switch (janFourth.getDay()) {
            case 0:
                return new Date(janFourth.getFullYear() - 1, 11, 29);
            case 1:
                return janFourth;
            case 2:
                return new Date(janFourth.getFullYear(), 0, 3);
            case 3:
                return new Date(janFourth.getFullYear(), 0, 2);
            case 4:
                return new Date(janFourth.getFullYear(), 0, 1);
            case 5:
                return new Date(janFourth.getFullYear() - 1, 11, 31);
            case 6:
                return new Date(janFourth.getFullYear() - 1, 11, 30)
        }
    }

    function getWeekBasedYear(date) {
        var thisDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
        var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
        var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
        var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
        var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
        if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
            if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
                return thisDate.getFullYear() + 1
            } else {
                return thisDate.getFullYear()
            }
        } else {
            return thisDate.getFullYear() - 1
        }
    }
    var EXPANSION_RULES_2 = {
        "%a": function(date) {
            return WEEKDAYS[date.tm_wday].substring(0, 3)
        },
        "%A": function(date) {
            return WEEKDAYS[date.tm_wday]
        },
        "%b": function(date) {
            return MONTHS[date.tm_mon].substring(0, 3)
        },
        "%B": function(date) {
            return MONTHS[date.tm_mon]
        },
        "%C": function(date) {
            var year = date.tm_year + 1900;
            return leadingNulls(year / 100 | 0, 2)
        },
        "%d": function(date) {
            return leadingNulls(date.tm_mday, 2)
        },
        "%e": function(date) {
            return leadingSomething(date.tm_mday, 2, " ")
        },
        "%g": function(date) {
            return getWeekBasedYear(date).toString().substring(2)
        },
        "%G": function(date) {
            return getWeekBasedYear(date)
        },
        "%H": function(date) {
            return leadingNulls(date.tm_hour, 2)
        },
        "%I": function(date) {
            var twelveHour = date.tm_hour;
            if (twelveHour == 0) twelveHour = 12;
            else if (twelveHour > 12) twelveHour -= 12;
            return leadingNulls(twelveHour, 2)
        },
        "%j": function(date) {
            return leadingNulls(date.tm_mday + __arraySum(__isLeapYear(date.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon - 1), 3)
        },
        "%m": function(date) {
            return leadingNulls(date.tm_mon + 1, 2)
        },
        "%M": function(date) {
            return leadingNulls(date.tm_min, 2)
        },
        "%n": function() {
            return "\n"
        },
        "%p": function(date) {
            if (date.tm_hour >= 0 && date.tm_hour < 12) {
                return "AM"
            } else {
                return "PM"
            }
        },
        "%S": function(date) {
            return leadingNulls(date.tm_sec, 2)
        },
        "%t": function() {
            return "\t"
        },
        "%u": function(date) {
            return date.tm_wday || 7
        },
        "%U": function(date) {
            var janFirst = new Date(date.tm_year + 1900, 0, 1);
            var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7 - janFirst.getDay());
            var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
            if (compareByDay(firstSunday, endDate) < 0) {
                var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
                var firstSundayUntilEndJanuary = 31 - firstSunday.getDate();
                var days = firstSundayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
                return leadingNulls(Math.ceil(days / 7), 2)
            }
            return compareByDay(firstSunday, janFirst) === 0 ? "01" : "00"
        },
        "%V": function(date) {
            var janFourthThisYear = new Date(date.tm_year + 1900, 0, 4);
            var janFourthNextYear = new Date(date.tm_year + 1901, 0, 4);
            var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
            var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
            var endDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
            if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
                return "53"
            }
            if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
                return "01"
            }
            var daysDifference;
            if (firstWeekStartThisYear.getFullYear() < date.tm_year + 1900) {
                daysDifference = date.tm_yday + 32 - firstWeekStartThisYear.getDate()
            } else {
                daysDifference = date.tm_yday + 1 - firstWeekStartThisYear.getDate()
            }
            return leadingNulls(Math.ceil(daysDifference / 7), 2)
        },
        "%w": function(date) {
            return date.tm_wday
        },
        "%W": function(date) {
            var janFirst = new Date(date.tm_year, 0, 1);
            var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7 - janFirst.getDay() + 1);
            var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
            if (compareByDay(firstMonday, endDate) < 0) {
                var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
                var firstMondayUntilEndJanuary = 31 - firstMonday.getDate();
                var days = firstMondayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
                return leadingNulls(Math.ceil(days / 7), 2)
            }
            return compareByDay(firstMonday, janFirst) === 0 ? "01" : "00"
        },
        "%y": function(date) {
            return (date.tm_year + 1900).toString().substring(2)
        },
        "%Y": function(date) {
            return date.tm_year + 1900
        },
        "%z": function(date) {
            var off = date.tm_gmtoff;
            var ahead = off >= 0;
            off = Math.abs(off) / 60;
            off = off / 60 * 100 + off % 60;
            return (ahead ? "+" : "-") + String("0000" + off).slice(-4)
        },
        "%Z": function(date) {
            return date.tm_zone
        },
        "%%": function() {
            return "%"
        }
    };
    for (var rule in EXPANSION_RULES_2) {
        if (pattern.indexOf(rule) >= 0) {
            pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date))
        }
    }
    var bytes = intArrayFromString(pattern, false);
    if (bytes.length > maxsize) {
        return 0
    }
    writeArrayToMemory(bytes, s);
    return bytes.length - 1
}

function _strftime_l(s, maxsize, format, tm) {
    return _strftime(s, maxsize, format, tm)
}

function _sysconf(name) {
    switch (name) {
        case 30:
            return PAGE_SIZE;
        case 85:
            var maxHeapSize = 2 * 1024 * 1024 * 1024 - 65536;
            return maxHeapSize / PAGE_SIZE;
        case 132:
        case 133:
        case 12:
        case 137:
        case 138:
        case 15:
        case 235:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 149:
        case 13:
        case 10:
        case 236:
        case 153:
        case 9:
        case 21:
        case 22:
        case 159:
        case 154:
        case 14:
        case 77:
        case 78:
        case 139:
        case 80:
        case 81:
        case 82:
        case 68:
        case 67:
        case 164:
        case 11:
        case 29:
        case 47:
        case 48:
        case 95:
        case 52:
        case 51:
        case 46:
            return 200809;
        case 79:
            return 0;
        case 27:
        case 246:
        case 127:
        case 128:
        case 23:
        case 24:
        case 160:
        case 161:
        case 181:
        case 182:
        case 242:
        case 183:
        case 184:
        case 243:
        case 244:
        case 245:
        case 165:
        case 178:
        case 179:
        case 49:
        case 50:
        case 168:
        case 169:
        case 175:
        case 170:
        case 171:
        case 172:
        case 97:
        case 76:
        case 32:
        case 173:
        case 35:
            return -1;
        case 176:
        case 177:
        case 7:
        case 155:
        case 8:
        case 157:
        case 125:
        case 126:
        case 92:
        case 93:
        case 129:
        case 130:
        case 131:
        case 94:
        case 91:
            return 1;
        case 74:
        case 60:
        case 69:
        case 70:
        case 4:
            return 1024;
        case 31:
        case 42:
        case 72:
            return 32;
        case 87:
        case 26:
        case 33:
            return 2147483647;
        case 34:
        case 1:
            return 47839;
        case 38:
        case 36:
            return 99;
        case 43:
        case 37:
            return 2048;
        case 0:
            return 2097152;
        case 3:
            return 65536;
        case 28:
            return 32768;
        case 44:
            return 32767;
        case 75:
            return 16384;
        case 39:
            return 1e3;
        case 89:
            return 700;
        case 71:
            return 256;
        case 40:
            return 255;
        case 2:
            return 100;
        case 180:
            return 64;
        case 25:
            return 20;
        case 5:
            return 16;
        case 6:
            return 6;
        case 73:
            return 4;
        case 84:
            {
                if (typeof navigator === "object") return navigator["hardwareConcurrency"] || 1;
                return 1
            }
    }
    ___setErrNo(28);
    return -1
}

function _system(command) {
    ___setErrNo(6);
    return -1
}

function _time(ptr) {
    var ret = Date.now() / 1e3 | 0;
    if (ptr) {
        HEAP32[ptr >> 2] = ret
    }
    return ret
}

function _uuid_generate(out) {
    var uuid = null;
    if (ENVIRONMENT_IS_NODE) {
        try {
            var rb = require("crypto")["randomBytes"];
            uuid = rb(16)
        } catch (e) {}
    } else if (ENVIRONMENT_IS_WEB && typeof window.crypto !== "undefined" && typeof window.crypto.getRandomValues !== "undefined") {
        uuid = new Uint8Array(16);
        window.crypto.getRandomValues(uuid)
    }
    if (!uuid) {
        uuid = new Array(16);
        var d = (new Date).getTime();
        for (var i = 0; i < 16; i++) {
            var r = (d + Math.random() * 256) % 256 | 0;
            d = d / 256 | 0;
            uuid[i] = r
        }
    }
    uuid[6] = uuid[6] & 15 | 64;
    uuid[8] = uuid[8] & 127 | 128;
    writeArrayToMemory(uuid, out)
}

function _uuid_unparse(uu, out, upper) {
    var i = 0;
    var uuid = "xxxx-xx-xx-xx-xxxxxx".replace(/[x]/g, function(c) {
        var r = upper ? HEAPU8[uu + i >> 0].toString(16).toUpperCase() : HEAPU8[uu + i >> 0].toString(16);
        r = r.length === 1 ? "0" + r : r;
        i++;
        return r
    });
    stringToUTF8(uuid, out, 37)
}
if (ENVIRONMENT_IS_NODE) {
    _emscripten_get_now = function _emscripten_get_now_actual() {
        var t = process["hrtime"]();
        return t[0] * 1e3 + t[1] / 1e6
    }
} else if (typeof dateNow !== "undefined") {
    _emscripten_get_now = dateNow
} else if (typeof performance === "object" && performance && typeof performance["now"] === "function") {
    _emscripten_get_now = function() {
        return performance["now"]()
    }
} else {
    _emscripten_get_now = Date.now
}
FS.staticInit();
Module["FS_createFolder"] = FS.createFolder;
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
Module["FS_createLazyFile"] = FS.createLazyFile;
Module["FS_createLink"] = FS.createLink;
Module["FS_createDevice"] = FS.createDevice;
Module["FS_unlink"] = FS.unlink;
embind_init_charCodes();
BindingError = Module["BindingError"] = extendError(Error, "BindingError");
InternalError = Module["InternalError"] = extendError(Error, "InternalError");
init_ClassHandle();
init_RegisteredPointer();
init_embind();
UnboundTypeError = Module["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
init_emval();
Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas, vrDevice) {
    err("Module.requestFullScreen is deprecated. Please call Module.requestFullscreen instead.");
    Module["requestFullScreen"] = Module["requestFullscreen"];
    Browser.requestFullScreen(lockPointer, resizeCanvas, vrDevice)
};
Module["requestFullscreen"] = function Module_requestFullscreen(lockPointer, resizeCanvas, vrDevice) {
    Browser.requestFullscreen(lockPointer, resizeCanvas, vrDevice)
};
Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) {
    Browser.requestAnimationFrame(func)
};
Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) {
    Browser.setCanvasSize(width, height, noUpdates)
};
Module["pauseMainLoop"] = function Module_pauseMainLoop() {
    Browser.mainLoop.pause()
};
Module["resumeMainLoop"] = function Module_resumeMainLoop() {
    Browser.mainLoop.resume()
};
Module["getUserMedia"] = function Module_getUserMedia() {
    Browser.getUserMedia()
};
Module["createContext"] = function Module_createContext(canvas, useWebGL, setInModule, webGLContextAttributes) {
    return Browser.createContext(canvas, useWebGL, setInModule, webGLContextAttributes)
};
var GLctx;
GL.init();

function intArrayFromString(stringy, dontAddNull, length) {
    var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
    var u8array = new Array(len);
    var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
    if (dontAddNull) u8array.length = numBytesWritten;
    return u8array
}

function invoke_iii(index, a1, a2) {
    var sp = stackSave();
    try {
        return dynCall_iii(index, a1, a2)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp") throw e;
        _setThrew(1, 0)
    }
}

function invoke_iiii(index, a1, a2, a3) {
    var sp = stackSave();
    try {
        return dynCall_iiii(index, a1, a2, a3)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp") throw e;
        _setThrew(1, 0)
    }
}

function invoke_iiiii(index, a1, a2, a3, a4) {
    var sp = stackSave();
    try {
        return dynCall_iiiii(index, a1, a2, a3, a4)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp") throw e;
        _setThrew(1, 0)
    }
}

function invoke_vii(index, a1, a2) {
    var sp = stackSave();
    try {
        dynCall_vii(index, a1, a2)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp") throw e;
        _setThrew(1, 0)
    }
}

function invoke_viiii(index, a1, a2, a3, a4) {
    var sp = stackSave();
    try {
        dynCall_viiii(index, a1, a2, a3, a4)
    } catch (e) {
        stackRestore(sp);
        if (e !== e + 0 && e !== "longjmp") throw e;
        _setThrew(1, 0)
    }
}
var asmGlobalArg = {};
var asmLibraryArg = {
    "e": ___assert_fail,
    "Id": ___buildEnvironment,
    "Hd": ___clock_gettime,
    "b": ___cxa_allocate_exception,
    "k": ___cxa_rethrow,
    "c": ___cxa_throw,
    "O": ___lock,
    "Gd": ___map_file,
    "ga": ___syscall10,
    "Fd": ___syscall125,
    "Ed": ___syscall192,
    "Dd": ___syscall194,
    "fa": ___syscall195,
    "Cd": ___syscall196,
    "Bd": ___syscall197,
    "Ad": ___syscall20,
    "N": ___syscall221,
    "zd": ___syscall3,
    "yd": ___syscall330,
    "xd": ___syscall38,
    "wd": ___syscall39,
    "vd": ___syscall4,
    "ud": ___syscall40,
    "M": ___syscall5,
    "td": ___syscall54,
    "sd": ___syscall63,
    "rd": ___syscall91,
    "w": ___unlock,
    "F": ___wasi_fd_close,
    "ea": ___wasi_fd_fdstat_get,
    "qd": ___wasi_fd_read,
    "ha": ___wasi_fd_seek,
    "pd": ___wasi_fd_sync,
    "od": ___wasi_fd_write,
    "nd": __embind_register_bool,
    "da": __embind_register_class,
    "md": __embind_register_emval,
    "L": __embind_register_enum,
    "K": __embind_register_enum_value,
    "ca": __embind_register_float,
    "g": __embind_register_function,
    "q": __embind_register_integer,
    "n": __embind_register_memory_view,
    "ba": __embind_register_std_string,
    "ld": __embind_register_std_wstring,
    "kd": __embind_register_void,
    "jd": __emscripten_push_main_loop_blocker,
    "J": __emval_as,
    "id": __emval_decref,
    "hd": __emval_get_global,
    "E": __emval_get_property,
    "gd": __emval_new_cstring,
    "fd": __emval_run_destructors,
    "__memory_base": 1024,
    "__table_base": 0,
    "a": _abort,
    "aa": _clock,
    "$": _clock_gettime,
    "ed": _difftime,
    "I": _emscripten_asm_const_di,
    "dd": _emscripten_asm_const_diii,
    "cd": _emscripten_asm_const_diiii,
    "i": _emscripten_asm_const_i,
    "f": _emscripten_asm_const_ii,
    "_": _emscripten_asm_const_iid,
    "t": _emscripten_asm_const_iii,
    "p": _emscripten_asm_const_iiii,
    "y": _emscripten_asm_const_iiiii,
    "bd": _emscripten_asm_const_iiiiii,
    "D": _emscripten_asm_const_iiiiiii,
    "ad": _emscripten_asm_const_iiiiiiiidi,
    "$c": _emscripten_async_wget_data,
    "_c": _emscripten_cancel_main_loop,
    "Zc": _emscripten_get_heap_size,
    "Yc": _emscripten_longjmp,
    "Xc": _emscripten_memcpy_big,
    "Wc": _emscripten_resize_heap,
    "v": _emscripten_run_script_string,
    "Vc": _emscripten_set_keydown_callback_on_thread,
    "Uc": _emscripten_set_keypress_callback_on_thread,
    "Tc": _emscripten_set_keyup_callback_on_thread,
    "Sc": _emscripten_set_main_loop,
    "Z": _emscripten_set_main_loop_timing,
    "Rc": _emscripten_set_mousedown_callback_on_thread,
    "Qc": _emscripten_set_mouseleave_callback_on_thread,
    "Pc": _emscripten_set_mousemove_callback_on_thread,
    "Oc": _emscripten_set_mouseup_callback_on_thread,
    "Nc": _emscripten_set_touchcancel_callback_on_thread,
    "Mc": _emscripten_set_touchend_callback_on_thread,
    "Lc": _emscripten_set_touchmove_callback_on_thread,
    "Kc": _emscripten_set_touchstart_callback_on_thread,
    "Jc": _emscripten_set_visibilitychange_callback_on_thread,
    "Ic": _emscripten_set_webglcontextlost_callback_on_thread,
    "Hc": _emscripten_set_webglcontextrestored_callback_on_thread,
    "Y": _emscripten_webgl_create_context,
    "H": _emscripten_webgl_destroy_context,
    "Gc": _emscripten_webgl_get_current_context,
    "Fc": _emscripten_webgl_init_context_attributes,
    "X": _emscripten_webgl_make_context_current,
    "W": _exit,
    "o": _getenv,
    "Ec": _glActiveTexture,
    "Dc": _glAttachShader,
    "Cc": _glBindAttribLocation,
    "Bc": _glBindBuffer,
    "Ac": _glBindFramebuffer,
    "zc": _glBindRenderbuffer,
    "yc": _glBindTexture,
    "xc": _glBindVertexArray,
    "wc": _glBlendColor,
    "vc": _glBlendEquation,
    "uc": _glBlendEquationSeparate,
    "tc": _glBlendFunc,
    "sc": _glBlendFuncSeparate,
    "rc": _glBufferData,
    "qc": _glBufferSubData,
    "pc": _glCheckFramebufferStatus,
    "oc": _glClear,
    "nc": _glClearColor,
    "mc": _glClearDepthf,
    "lc": _glClearStencil,
    "kc": _glColorMask,
    "jc": _glCompileShader,
    "ic": _glCompressedTexImage2D,
    "hc": _glCompressedTexSubImage2D,
    "gc": _glCreateProgram,
    "fc": _glCreateShader,
    "ec": _glCullFace,
    "dc": _glDeleteBuffers,
    "cc": _glDeleteFramebuffers,
    "bc": _glDeleteProgram,
    "ac": _glDeleteRenderbuffers,
    "$b": _glDeleteShader,
    "_b": _glDeleteTextures,
    "Zb": _glDeleteVertexArrays,
    "Yb": _glDepthFunc,
    "Xb": _glDepthMask,
    "Wb": _glDepthRangef,
    "Vb": _glDetachShader,
    "Ub": _glDisable,
    "Tb": _glDisableVertexAttribArray,
    "Sb": _glDrawArrays,
    "Rb": _glDrawElements,
    "Qb": _glEnable,
    "Pb": _glEnableVertexAttribArray,
    "Ob": _glFinish,
    "Nb": _glFlush,
    "Mb": _glFramebufferRenderbuffer,
    "Lb": _glFramebufferTexture2D,
    "Kb": _glFrontFace,
    "Jb": _glGenBuffers,
    "Ib": _glGenFramebuffers,
    "Hb": _glGenRenderbuffers,
    "Gb": _glGenTextures,
    "Fb": _glGenVertexArrays,
    "Eb": _glGenerateMipmap,
    "Db": _glGetAttribLocation,
    "Cb": _glGetBooleanv,
    "Bb": _glGetError,
    "Ab": _glGetFloatv,
    "zb": _glGetIntegerv,
    "yb": _glGetProgramInfoLog,
    "xb": _glGetProgramiv,
    "wb": _glGetShaderInfoLog,
    "vb": _glGetShaderiv,
    "V": _glGetString,
    "ub": _glGetUniformLocation,
    "tb": _glHint,
    "sb": _glIsBuffer,
    "rb": _glIsFramebuffer,
    "qb": _glIsProgram,
    "pb": _glIsRenderbuffer,
    "ob": _glIsShader,
    "nb": _glIsTexture,
    "mb": _glIsVertexArray,
    "lb": _glLinkProgram,
    "kb": _glPixelStorei,
    "jb": _glPolygonOffset,
    "ib": _glReadPixels,
    "hb": _glRenderbufferStorage,
    "gb": _glScissor,
    "fb": _glShaderBinary,
    "eb": _glShaderSource,
    "db": _glStencilFunc,
    "cb": _glStencilFuncSeparate,
    "bb": _glStencilMask,
    "ab": _glStencilMaskSeparate,
    "$a": _glStencilOp,
    "_a": _glStencilOpSeparate,
    "Za": _glTexImage2D,
    "Ya": _glTexParameterf,
    "Xa": _glTexParameterfv,
    "Wa": _glTexParameteri,
    "Va": _glTexParameteriv,
    "Ua": _glTexSubImage2D,
    "Ta": _glUniform1f,
    "Sa": _glUniform1fv,
    "Ra": _glUniform1i,
    "Qa": _glUniform1iv,
    "Pa": _glUniform2f,
    "Oa": _glUniform2fv,
    "Na": _glUniform2i,
    "Ma": _glUniform2iv,
    "La": _glUniform3f,
    "Ka": _glUniform3fv,
    "Ja": _glUniform3i,
    "Ia": _glUniform3iv,
    "Ha": _glUniform4f,
    "Ga": _glUniform4fv,
    "Fa": _glUniform4i,
    "Ea": _glUniform4iv,
    "Da": _glUniformMatrix2fv,
    "Ca": _glUniformMatrix3fv,
    "Ba": _glUniformMatrix4fv,
    "Aa": _glUseProgram,
    "za": _glValidateProgram,
    "ya": _glVertexAttribPointer,
    "xa": _glViewport,
    "u": _gmtime,
    "C": _gmtime_r,
    "wa": _llvm_exp2_f32,
    "va": _llvm_exp2_f64,
    "B": _llvm_log10_f64,
    "ua": _llvm_log2_f64,
    "s": _llvm_stackrestore,
    "r": _llvm_stacksave,
    "G": _llvm_trap,
    "A": _localtime,
    "U": _localtime_r,
    "m": _longjmp,
    "x": _mktime,
    "ta": _pthread_cond_destroy,
    "T": _pthread_create,
    "sa": _pthread_join,
    "S": _pthread_mutexattr_destroy,
    "ra": _pthread_mutexattr_init,
    "qa": _pthread_mutexattr_settype,
    "R": _sched_yield,
    "z": _strftime,
    "pa": _strftime_l,
    "oa": _sysconf,
    "na": _system,
    "h": _time,
    "ma": _uuid_generate,
    "la": _uuid_unparse,
    "d": abort,
    "l": getTempRet0,
    "ka": invoke_iii,
    "Q": invoke_iiii,
    "ja": invoke_iiiii,
    "P": invoke_vii,
    "ia": invoke_viiii,
    "memory": wasmMemory,
    "j": setTempRet0,
    "table": wasmTable
};
var asm = Module["asm"](asmGlobalArg, asmLibraryArg, buffer);
Module["asm"] = asm;
var __GLOBAL__sub_I_APEarningsCalendar_cpp = Module["__GLOBAL__sub_I_APEarningsCalendar_cpp"] = function() {
    return Module["asm"]["Jd"].apply(null, arguments)
};
var __GLOBAL__sub_I_APForexCalendar_cpp = Module["__GLOBAL__sub_I_APForexCalendar_cpp"] = function() {
    return Module["asm"]["Kd"].apply(null, arguments)
};
var __GLOBAL__sub_I_APInfoBlock_cpp = Module["__GLOBAL__sub_I_APInfoBlock_cpp"] = function() {
    return Module["asm"]["Ld"].apply(null, arguments)
};
var __GLOBAL__sub_I_APLiveStatistic_cpp = Module["__GLOBAL__sub_I_APLiveStatistic_cpp"] = function() {
    return Module["asm"]["Md"].apply(null, arguments)
};
var __GLOBAL__sub_I_APNews_cpp = Module["__GLOBAL__sub_I_APNews_cpp"] = function() {
    return Module["asm"]["Nd"].apply(null, arguments)
};
var __GLOBAL__sub_I_APOvernightInfo_cpp = Module["__GLOBAL__sub_I_APOvernightInfo_cpp"] = function() {
    return Module["asm"]["Od"].apply(null, arguments)
};
var __GLOBAL__sub_I_APScheduleInfo_cpp = Module["__GLOBAL__sub_I_APScheduleInfo_cpp"] = function() {
    return Module["asm"]["Pd"].apply(null, arguments)
};
var __GLOBAL__sub_I_APTableControl_cpp = Module["__GLOBAL__sub_I_APTableControl_cpp"] = function() {
    return Module["asm"]["Qd"].apply(null, arguments)
};
var __GLOBAL__sub_I_APTechnicalAnalysis_cpp = Module["__GLOBAL__sub_I_APTechnicalAnalysis_cpp"] = function() {
    return Module["asm"]["Rd"].apply(null, arguments)
};
var __GLOBAL__sub_I_APTradeInfoBinaryProfit_cpp = Module["__GLOBAL__sub_I_APTradeInfoBinaryProfit_cpp"] = function() {
    return Module["asm"]["Sd"].apply(null, arguments)
};
var __GLOBAL__sub_I_APTradeInfoExpirations_cpp = Module["__GLOBAL__sub_I_APTradeInfoExpirations_cpp"] = function() {
    return Module["asm"]["Td"].apply(null, arguments)
};
var __GLOBAL__sub_I_APTradeInfo_cpp = Module["__GLOBAL__sub_I_APTradeInfo_cpp"] = function() {
    return Module["asm"]["Ud"].apply(null, arguments)
};
var __GLOBAL__sub_I_ActiveGroupSelector_cpp = Module["__GLOBAL__sub_I_ActiveGroupSelector_cpp"] = function() {
    return Module["asm"]["Vd"].apply(null, arguments)
};
var __GLOBAL__sub_I_ActiveSelectorLeftPartPrivate_cpp = Module["__GLOBAL__sub_I_ActiveSelectorLeftPartPrivate_cpp"] = function() {
    return Module["asm"]["Wd"].apply(null, arguments)
};
var __GLOBAL__sub_I_ActiveSelectorLeftPart_cpp = Module["__GLOBAL__sub_I_ActiveSelectorLeftPart_cpp"] = function() {
    return Module["asm"]["Xd"].apply(null, arguments)
};
var __GLOBAL__sub_I_ActiveSelectorSearchFactories_cpp = Module["__GLOBAL__sub_I_ActiveSelectorSearchFactories_cpp"] = function() {
    return Module["asm"]["Yd"].apply(null, arguments)
};
var __GLOBAL__sub_I_ActiveSelectorSearchModel_cpp = Module["__GLOBAL__sub_I_ActiveSelectorSearchModel_cpp"] = function() {
    return Module["asm"]["Zd"].apply(null, arguments)
};
var __GLOBAL__sub_I_ActiveSelectorSearch_cpp = Module["__GLOBAL__sub_I_ActiveSelectorSearch_cpp"] = function() {
    return Module["asm"]["_d"].apply(null, arguments)
};
var __GLOBAL__sub_I_ActiveSelectorSortController_cpp = Module["__GLOBAL__sub_I_ActiveSelectorSortController_cpp"] = function() {
    return Module["asm"]["$d"].apply(null, arguments)
};
var __GLOBAL__sub_I_ActivesController_cpp = Module["__GLOBAL__sub_I_ActivesController_cpp"] = function() {
    return Module["asm"]["ae"].apply(null, arguments)
};
var __GLOBAL__sub_I_ActivesPositionsCounter_cpp = Module["__GLOBAL__sub_I_ActivesPositionsCounter_cpp"] = function() {
    return Module["asm"]["be"].apply(null, arguments)
};
var __GLOBAL__sub_I_AlertsLPActiveModel_cpp = Module["__GLOBAL__sub_I_AlertsLPActiveModel_cpp"] = function() {
    return Module["asm"]["ce"].apply(null, arguments)
};
var __GLOBAL__sub_I_AlertsLPHistoryModel_cpp = Module["__GLOBAL__sub_I_AlertsLPHistoryModel_cpp"] = function() {
    return Module["asm"]["de"].apply(null, arguments)
};
var __GLOBAL__sub_I_AlertsLPModelBase_cpp = Module["__GLOBAL__sub_I_AlertsLPModelBase_cpp"] = function() {
    return Module["asm"]["ee"].apply(null, arguments)
};
var __GLOBAL__sub_I_AlertsLeftPanel_cpp = Module["__GLOBAL__sub_I_AlertsLeftPanel_cpp"] = function() {
    return Module["asm"]["fe"].apply(null, arguments)
};
var __GLOBAL__sub_I_AlertsListViewFactories_cpp = Module["__GLOBAL__sub_I_AlertsListViewFactories_cpp"] = function() {
    return Module["asm"]["ge"].apply(null, arguments)
};
var __GLOBAL__sub_I_AlertsService_cpp = Module["__GLOBAL__sub_I_AlertsService_cpp"] = function() {
    return Module["asm"]["he"].apply(null, arguments)
};
var __GLOBAL__sub_I_AnimationGroup_cpp = Module["__GLOBAL__sub_I_AnimationGroup_cpp"] = function() {
    return Module["asm"]["ie"].apply(null, arguments)
};
var __GLOBAL__sub_I_AppCoreCommon_cpp = Module["__GLOBAL__sub_I_AppCoreCommon_cpp"] = function() {
    return Module["asm"]["je"].apply(null, arguments)
};
var __GLOBAL__sub_I_AppCoreWeb_cpp = Module["__GLOBAL__sub_I_AppCoreWeb_cpp"] = function() {
    return Module["asm"]["ke"].apply(null, arguments)
};
var __GLOBAL__sub_I_ApplicationIQ_cpp = Module["__GLOBAL__sub_I_ApplicationIQ_cpp"] = function() {
    return Module["asm"]["le"].apply(null, arguments)
};
var __GLOBAL__sub_I_AssetQuotesProvider_cpp = Module["__GLOBAL__sub_I_AssetQuotesProvider_cpp"] = function() {
    return Module["asm"]["me"].apply(null, arguments)
};
var __GLOBAL__sub_I_AssetsService_cpp = Module["__GLOBAL__sub_I_AssetsService_cpp"] = function() {
    return Module["asm"]["ne"].apply(null, arguments)
};
var __GLOBAL__sub_I_AuthServiceV2_cpp = Module["__GLOBAL__sub_I_AuthServiceV2_cpp"] = function() {
    return Module["asm"]["oe"].apply(null, arguments)
};
var __GLOBAL__sub_I_AuthService_cpp = Module["__GLOBAL__sub_I_AuthService_cpp"] = function() {
    return Module["asm"]["pe"].apply(null, arguments)
};
var __GLOBAL__sub_I_AutomationValue_cpp = Module["__GLOBAL__sub_I_AutomationValue_cpp"] = function() {
    return Module["asm"]["qe"].apply(null, arguments)
};
var __GLOBAL__sub_I_Automation_cpp = Module["__GLOBAL__sub_I_Automation_cpp"] = function() {
    return Module["asm"]["re"].apply(null, arguments)
};
var __GLOBAL__sub_I_BalanceCommands_cpp = Module["__GLOBAL__sub_I_BalanceCommands_cpp"] = function() {
    return Module["asm"]["se"].apply(null, arguments)
};
var __GLOBAL__sub_I_BalanceData_cpp = Module["__GLOBAL__sub_I_BalanceData_cpp"] = function() {
    return Module["asm"]["te"].apply(null, arguments)
};
var __GLOBAL__sub_I_BalanceHeaderCash_cpp = Module["__GLOBAL__sub_I_BalanceHeaderCash_cpp"] = function() {
    return Module["asm"]["ue"].apply(null, arguments)
};
var __GLOBAL__sub_I_BalanceHeaderMargin_cpp = Module["__GLOBAL__sub_I_BalanceHeaderMargin_cpp"] = function() {
    return Module["asm"]["ve"].apply(null, arguments)
};
var __GLOBAL__sub_I_BalanceHeader_cpp = Module["__GLOBAL__sub_I_BalanceHeader_cpp"] = function() {
    return Module["asm"]["we"].apply(null, arguments)
};
var __GLOBAL__sub_I_BalancesBaseItems_cpp = Module["__GLOBAL__sub_I_BalancesBaseItems_cpp"] = function() {
    return Module["asm"]["xe"].apply(null, arguments)
};
var __GLOBAL__sub_I_BalancesCashPanel_cpp = Module["__GLOBAL__sub_I_BalancesCashPanel_cpp"] = function() {
    return Module["asm"]["ye"].apply(null, arguments)
};
var __GLOBAL__sub_I_BalancesMarginPanel_cpp = Module["__GLOBAL__sub_I_BalancesMarginPanel_cpp"] = function() {
    return Module["asm"]["ze"].apply(null, arguments)
};
var __GLOBAL__sub_I_BalancesService_cpp = Module["__GLOBAL__sub_I_BalancesService_cpp"] = function() {
    return Module["asm"]["Ae"].apply(null, arguments)
};
var __GLOBAL__sub_I_Base_cpp = Module["__GLOBAL__sub_I_Base_cpp"] = function() {
    return Module["asm"]["Be"].apply(null, arguments)
};
var __GLOBAL__sub_I_BillingService_cpp = Module["__GLOBAL__sub_I_BillingService_cpp"] = function() {
    return Module["asm"]["Ce"].apply(null, arguments)
};
var __GLOBAL__sub_I_BinaryTradeService_cpp = Module["__GLOBAL__sub_I_BinaryTradeService_cpp"] = function() {
    return Module["asm"]["De"].apply(null, arguments)
};
var __GLOBAL__sub_I_BrandedFeatures_cpp = Module["__GLOBAL__sub_I_BrandedFeatures_cpp"] = function() {
    return Module["asm"]["Ee"].apply(null, arguments)
};
var __GLOBAL__sub_I_BuySellHighlight_cpp = Module["__GLOBAL__sub_I_BuySellHighlight_cpp"] = function() {
    return Module["asm"]["Fe"].apply(null, arguments)
};
var __GLOBAL__sub_I_BuybackService_cpp = Module["__GLOBAL__sub_I_BuybackService_cpp"] = function() {
    return Module["asm"]["Ge"].apply(null, arguments)
};
var __GLOBAL__sub_I_CActiveSelector_cpp = Module["__GLOBAL__sub_I_CActiveSelector_cpp"] = function() {
    return Module["asm"]["He"].apply(null, arguments)
};
var __GLOBAL__sub_I_CAlerts_cpp = Module["__GLOBAL__sub_I_CAlerts_cpp"] = function() {
    return Module["asm"]["Ie"].apply(null, arguments)
};
var __GLOBAL__sub_I_CAmountSelector_cpp = Module["__GLOBAL__sub_I_CAmountSelector_cpp"] = function() {
    return Module["asm"]["Je"].apply(null, arguments)
};
var __GLOBAL__sub_I_CAppUpdate_cpp = Module["__GLOBAL__sub_I_CAppUpdate_cpp"] = function() {
    return Module["asm"]["Ke"].apply(null, arguments)
};
var __GLOBAL__sub_I_CAssetElement_cpp = Module["__GLOBAL__sub_I_CAssetElement_cpp"] = function() {
    return Module["asm"]["Le"].apply(null, arguments)
};
var __GLOBAL__sub_I_CAssetInfo_cpp = Module["__GLOBAL__sub_I_CAssetInfo_cpp"] = function() {
    return Module["asm"]["Me"].apply(null, arguments)
};
var __GLOBAL__sub_I_CAssetProfile_cpp = Module["__GLOBAL__sub_I_CAssetProfile_cpp"] = function() {
    return Module["asm"]["Ne"].apply(null, arguments)
};
var __GLOBAL__sub_I_CAssetRenderPrivate_cpp = Module["__GLOBAL__sub_I_CAssetRenderPrivate_cpp"] = function() {
    return Module["asm"]["Oe"].apply(null, arguments)
};
var __GLOBAL__sub_I_CAssetRender_cpp = Module["__GLOBAL__sub_I_CAssetRender_cpp"] = function() {
    return Module["asm"]["Pe"].apply(null, arguments)
};
var __GLOBAL__sub_I_CAutomarginDialog_cpp = Module["__GLOBAL__sub_I_CAutomarginDialog_cpp"] = function() {
    return Module["asm"]["Qe"].apply(null, arguments)
};
var __GLOBAL__sub_I_CBalanceElement_cpp = Module["__GLOBAL__sub_I_CBalanceElement_cpp"] = function() {
    return Module["asm"]["Re"].apply(null, arguments)
};
var __GLOBAL__sub_I_CBalances_cpp = Module["__GLOBAL__sub_I_CBalances_cpp"] = function() {
    return Module["asm"]["Se"].apply(null, arguments)
};
var __GLOBAL__sub_I_CBaseTrading_cpp = Module["__GLOBAL__sub_I_CBaseTrading_cpp"] = function() {
    return Module["asm"]["Te"].apply(null, arguments)
};
var __GLOBAL__sub_I_CBinaryDealIndication_cpp = Module["__GLOBAL__sub_I_CBinaryDealIndication_cpp"] = function() {
    return Module["asm"]["Ue"].apply(null, arguments)
};
var __GLOBAL__sub_I_CBinaryExpiration_cpp = Module["__GLOBAL__sub_I_CBinaryExpiration_cpp"] = function() {
    return Module["asm"]["Ve"].apply(null, arguments)
};
var __GLOBAL__sub_I_CBinaryRightPanel_cpp = Module["__GLOBAL__sub_I_CBinaryRightPanel_cpp"] = function() {
    return Module["asm"]["We"].apply(null, arguments)
};
var __GLOBAL__sub_I_CBinaryTrading_cpp = Module["__GLOBAL__sub_I_CBinaryTrading_cpp"] = function() {
    return Module["asm"]["Xe"].apply(null, arguments)
};
var __GLOBAL__sub_I_CBuyBackPopup_cpp = Module["__GLOBAL__sub_I_CBuyBackPopup_cpp"] = function() {
    return Module["asm"]["Ye"].apply(null, arguments)
};
var __GLOBAL__sub_I_CBuyBack_cpp = Module["__GLOBAL__sub_I_CBuyBack_cpp"] = function() {
    return Module["asm"]["Ze"].apply(null, arguments)
};
var __GLOBAL__sub_I_CCFDPlotProfit_cpp = Module["__GLOBAL__sub_I_CCFDPlotProfit_cpp"] = function() {
    return Module["asm"]["_e"].apply(null, arguments)
};
var __GLOBAL__sub_I_CCFDPositionIndication_cpp = Module["__GLOBAL__sub_I_CCFDPositionIndication_cpp"] = function() {
    return Module["asm"]["$e"].apply(null, arguments)
};
var __GLOBAL__sub_I_CCFDRightPanel_cpp = Module["__GLOBAL__sub_I_CCFDRightPanel_cpp"] = function() {
    return Module["asm"]["af"].apply(null, arguments)
};
var __GLOBAL__sub_I_CCFDSmallClosePosition_cpp = Module["__GLOBAL__sub_I_CCFDSmallClosePosition_cpp"] = function() {
    return Module["asm"]["bf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChatAttachmentDropdown_cpp = Module["__GLOBAL__sub_I_CChatAttachmentDropdown_cpp"] = function() {
    return Module["asm"]["cf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChatAttachmentElement_cpp = Module["__GLOBAL__sub_I_CChatAttachmentElement_cpp"] = function() {
    return Module["asm"]["df"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChatAttachmentPanel_cpp = Module["__GLOBAL__sub_I_CChatAttachmentPanel_cpp"] = function() {
    return Module["asm"]["ef"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChatBottomDeposit_cpp = Module["__GLOBAL__sub_I_CChatBottomDeposit_cpp"] = function() {
    return Module["asm"]["ff"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChatBottomEnterText_cpp = Module["__GLOBAL__sub_I_CChatBottomEnterText_cpp"] = function() {
    return Module["asm"]["gf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChatBottomPanel_cpp = Module["__GLOBAL__sub_I_CChatBottomPanel_cpp"] = function() {
    return Module["asm"]["hf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChatBottomTradingVolume_cpp = Module["__GLOBAL__sub_I_CChatBottomTradingVolume_cpp"] = function() {
    return Module["asm"]["jf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChatCache_cpp = Module["__GLOBAL__sub_I_CChatCache_cpp"] = function() {
    return Module["asm"]["kf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChatEmojiPanel_cpp = Module["__GLOBAL__sub_I_CChatEmojiPanel_cpp"] = function() {
    return Module["asm"]["lf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChatLeftPanel_cpp = Module["__GLOBAL__sub_I_CChatLeftPanel_cpp"] = function() {
    return Module["asm"]["mf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChatMessageElement_cpp = Module["__GLOBAL__sub_I_CChatMessageElement_cpp"] = function() {
    return Module["asm"]["nf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChatMessageList_cpp = Module["__GLOBAL__sub_I_CChatMessageList_cpp"] = function() {
    return Module["asm"]["of"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChatMessagePanel_cpp = Module["__GLOBAL__sub_I_CChatMessagePanel_cpp"] = function() {
    return Module["asm"]["pf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChatMessageSuggestionElement_cpp = Module["__GLOBAL__sub_I_CChatMessageSuggestionElement_cpp"] = function() {
    return Module["asm"]["qf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChatModeration_cpp = Module["__GLOBAL__sub_I_CChatModeration_cpp"] = function() {
    return Module["asm"]["rf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChatRateSupportElement_cpp = Module["__GLOBAL__sub_I_CChatRateSupportElement_cpp"] = function() {
    return Module["asm"]["sf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChatRoomInfoElement_cpp = Module["__GLOBAL__sub_I_CChatRoomInfoElement_cpp"] = function() {
    return Module["asm"]["tf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChatRoomPanel_cpp = Module["__GLOBAL__sub_I_CChatRoomPanel_cpp"] = function() {
    return Module["asm"]["uf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChatRules_cpp = Module["__GLOBAL__sub_I_CChatRules_cpp"] = function() {
    return Module["asm"]["vf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChatSendMessageError_cpp = Module["__GLOBAL__sub_I_CChatSendMessageError_cpp"] = function() {
    return Module["asm"]["wf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChatSettings_cpp = Module["__GLOBAL__sub_I_CChatSettings_cpp"] = function() {
    return Module["asm"]["xf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChatStatusPanel_cpp = Module["__GLOBAL__sub_I_CChatStatusPanel_cpp"] = function() {
    return Module["asm"]["yf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChatUtils_cpp = Module["__GLOBAL__sub_I_CChatUtils_cpp"] = function() {
    return Module["asm"]["zf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CChat_cpp = Module["__GLOBAL__sub_I_CChat_cpp"] = function() {
    return Module["asm"]["Af"].apply(null, arguments)
};
var __GLOBAL__sub_I_CClientCategoryDialog_cpp = Module["__GLOBAL__sub_I_CClientCategoryDialog_cpp"] = function() {
    return Module["asm"]["Bf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CColorPickerPopup_cpp = Module["__GLOBAL__sub_I_CColorPickerPopup_cpp"] = function() {
    return Module["asm"]["Cf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CCommonConfirmPopup_cpp = Module["__GLOBAL__sub_I_CCommonConfirmPopup_cpp"] = function() {
    return Module["asm"]["Df"].apply(null, arguments)
};
var __GLOBAL__sub_I_CContactSupportStatusBar_cpp = Module["__GLOBAL__sub_I_CContactSupportStatusBar_cpp"] = function() {
    return Module["asm"]["Ef"].apply(null, arguments)
};
var __GLOBAL__sub_I_CCryptoCalendar_cpp = Module["__GLOBAL__sub_I_CCryptoCalendar_cpp"] = function() {
    return Module["asm"]["Ff"].apply(null, arguments)
};
var __GLOBAL__sub_I_CDashboardItemConstructor_cpp = Module["__GLOBAL__sub_I_CDashboardItemConstructor_cpp"] = function() {
    return Module["asm"]["Gf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CDashboard_cpp = Module["__GLOBAL__sub_I_CDashboard_cpp"] = function() {
    return Module["asm"]["Hf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CDealInfo_cpp = Module["__GLOBAL__sub_I_CDealInfo_cpp"] = function() {
    return Module["asm"]["If"].apply(null, arguments)
};
var __GLOBAL__sub_I_CDealsCommissionHistory_cpp = Module["__GLOBAL__sub_I_CDealsCommissionHistory_cpp"] = function() {
    return Module["asm"]["Jf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CDepositCompact_cpp = Module["__GLOBAL__sub_I_CDepositCompact_cpp"] = function() {
    return Module["asm"]["Kf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CDepositController_cpp = Module["__GLOBAL__sub_I_CDepositController_cpp"] = function() {
    return Module["asm"]["Lf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CDepositKYCPanel_cpp = Module["__GLOBAL__sub_I_CDepositKYCPanel_cpp"] = function() {
    return Module["asm"]["Mf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CDepositPaymentFormPanel_cpp = Module["__GLOBAL__sub_I_CDepositPaymentFormPanel_cpp"] = function() {
    return Module["asm"]["Nf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CDepositPaymentSelectPanel_cpp = Module["__GLOBAL__sub_I_CDepositPaymentSelectPanel_cpp"] = function() {
    return Module["asm"]["Of"].apply(null, arguments)
};
var __GLOBAL__sub_I_CDepositRegulatorIcons_cpp = Module["__GLOBAL__sub_I_CDepositRegulatorIcons_cpp"] = function() {
    return Module["asm"]["Pf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CDepositTournamentRebuyPanel_cpp = Module["__GLOBAL__sub_I_CDepositTournamentRebuyPanel_cpp"] = function() {
    return Module["asm"]["Qf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CDepositV3_cpp = Module["__GLOBAL__sub_I_CDepositV3_cpp"] = function() {
    return Module["asm"]["Rf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CDepositV4_cpp = Module["__GLOBAL__sub_I_CDepositV4_cpp"] = function() {
    return Module["asm"]["Sf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CDeposit_cpp = Module["__GLOBAL__sub_I_CDeposit_cpp"] = function() {
    return Module["asm"]["Tf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CDigitalDealIndication_cpp = Module["__GLOBAL__sub_I_CDigitalDealIndication_cpp"] = function() {
    return Module["asm"]["Uf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CDigitalPlotProfit_cpp = Module["__GLOBAL__sub_I_CDigitalPlotProfit_cpp"] = function() {
    return Module["asm"]["Vf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CDigitalTrading_cpp = Module["__GLOBAL__sub_I_CDigitalTrading_cpp"] = function() {
    return Module["asm"]["Wf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CEarningsCalendar_cpp = Module["__GLOBAL__sub_I_CEarningsCalendar_cpp"] = function() {
    return Module["asm"]["Xf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CEconomicCalendar_cpp = Module["__GLOBAL__sub_I_CEconomicCalendar_cpp"] = function() {
    return Module["asm"]["Yf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CEditAlert_cpp = Module["__GLOBAL__sub_I_CEditAlert_cpp"] = function() {
    return Module["asm"]["Zf"].apply(null, arguments)
};
var __GLOBAL__sub_I_CEmailActivation_cpp = Module["__GLOBAL__sub_I_CEmailActivation_cpp"] = function() {
    return Module["asm"]["_f"].apply(null, arguments)
};
var __GLOBAL__sub_I_CExchangeInfoPanel_cpp = Module["__GLOBAL__sub_I_CExchangeInfoPanel_cpp"] = function() {
    return Module["asm"]["$f"].apply(null, arguments)
};
var __GLOBAL__sub_I_CExchangePositionIndication_cpp = Module["__GLOBAL__sub_I_CExchangePositionIndication_cpp"] = function() {
    return Module["asm"]["ag"].apply(null, arguments)
};
var __GLOBAL__sub_I_CExchangeRightPanel_cpp = Module["__GLOBAL__sub_I_CExchangeRightPanel_cpp"] = function() {
    return Module["asm"]["bg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CExchangeTrading_cpp = Module["__GLOBAL__sub_I_CExchangeTrading_cpp"] = function() {
    return Module["asm"]["cg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CExpBalloon_cpp = Module["__GLOBAL__sub_I_CExpBalloon_cpp"] = function() {
    return Module["asm"]["dg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CFDTradeService_cpp = Module["__GLOBAL__sub_I_CFDTradeService_cpp"] = function() {
    return Module["asm"]["eg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CFXDealIndication_cpp = Module["__GLOBAL__sub_I_CFXDealIndication_cpp"] = function() {
    return Module["asm"]["fg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CFXPlotProfit_cpp = Module["__GLOBAL__sub_I_CFXPlotProfit_cpp"] = function() {
    return Module["asm"]["gg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CFXProfitIndicator_cpp = Module["__GLOBAL__sub_I_CFXProfitIndicator_cpp"] = function() {
    return Module["asm"]["hg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CFXTrading_cpp = Module["__GLOBAL__sub_I_CFXTrading_cpp"] = function() {
    return Module["asm"]["ig"].apply(null, arguments)
};
var __GLOBAL__sub_I_CFilteredEconomicCalendarEvents_cpp = Module["__GLOBAL__sub_I_CFilteredEconomicCalendarEvents_cpp"] = function() {
    return Module["asm"]["jg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CGDPR_cpp = Module["__GLOBAL__sub_I_CGDPR_cpp"] = function() {
    return Module["asm"]["kg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CGridOfViewsScenario_cpp = Module["__GLOBAL__sub_I_CGridOfViewsScenario_cpp"] = function() {
    return Module["asm"]["lg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CGridOfViews_cpp = Module["__GLOBAL__sub_I_CGridOfViews_cpp"] = function() {
    return Module["asm"]["mg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CHiLo_cpp = Module["__GLOBAL__sub_I_CHiLo_cpp"] = function() {
    return Module["asm"]["ng"].apply(null, arguments)
};
var __GLOBAL__sub_I_CImageListPreview_cpp = Module["__GLOBAL__sub_I_CImageListPreview_cpp"] = function() {
    return Module["asm"]["og"].apply(null, arguments)
};
var __GLOBAL__sub_I_CIndicatorsWelcomePopup_cpp = Module["__GLOBAL__sub_I_CIndicatorsWelcomePopup_cpp"] = function() {
    return Module["asm"]["pg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CIndicators_cpp = Module["__GLOBAL__sub_I_CIndicators_cpp"] = function() {
    return Module["asm"]["qg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CInstrument_cpp = Module["__GLOBAL__sub_I_CInstrument_cpp"] = function() {
    return Module["asm"]["rg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CLeaderboard_cpp = Module["__GLOBAL__sub_I_CLeaderboard_cpp"] = function() {
    return Module["asm"]["sg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CLeftPanel_cpp = Module["__GLOBAL__sub_I_CLeftPanel_cpp"] = function() {
    return Module["asm"]["tg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CLiveDeals_cpp = Module["__GLOBAL__sub_I_CLiveDeals_cpp"] = function() {
    return Module["asm"]["ug"].apply(null, arguments)
};
var __GLOBAL__sub_I_CMainIndicators_cpp = Module["__GLOBAL__sub_I_CMainIndicators_cpp"] = function() {
    return Module["asm"]["vg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CMain_cpp = Module["__GLOBAL__sub_I_CMain_cpp"] = function() {
    return Module["asm"]["wg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CMarginalForexRightPanel_cpp = Module["__GLOBAL__sub_I_CMarginalForexRightPanel_cpp"] = function() {
    return Module["asm"]["xg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CMarketAnalysis_cpp = Module["__GLOBAL__sub_I_CMarketAnalysis_cpp"] = function() {
    return Module["asm"]["yg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CMinimumInvestmentController_cpp = Module["__GLOBAL__sub_I_CMinimumInvestmentController_cpp"] = function() {
    return Module["asm"]["zg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CMonitoring_cpp = Module["__GLOBAL__sub_I_CMonitoring_cpp"] = function() {
    return Module["asm"]["Ag"].apply(null, arguments)
};
var __GLOBAL__sub_I_CNewsCalendarBase_cpp = Module["__GLOBAL__sub_I_CNewsCalendarBase_cpp"] = function() {
    return Module["asm"]["Bg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CNews_cpp = Module["__GLOBAL__sub_I_CNews_cpp"] = function() {
    return Module["asm"]["Cg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CNotifications_cpp = Module["__GLOBAL__sub_I_CNotifications_cpp"] = function() {
    return Module["asm"]["Dg"].apply(null, arguments)
};
var __GLOBAL__sub_I_COrderBookHistory_cpp = Module["__GLOBAL__sub_I_COrderBookHistory_cpp"] = function() {
    return Module["asm"]["Eg"].apply(null, arguments)
};
var __GLOBAL__sub_I_COrderBookSetups_cpp = Module["__GLOBAL__sub_I_COrderBookSetups_cpp"] = function() {
    return Module["asm"]["Fg"].apply(null, arguments)
};
var __GLOBAL__sub_I_COrderBook_cpp = Module["__GLOBAL__sub_I_COrderBook_cpp"] = function() {
    return Module["asm"]["Gg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CPartialCloseDialog_cpp = Module["__GLOBAL__sub_I_CPartialCloseDialog_cpp"] = function() {
    return Module["asm"]["Hg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CPendingConfirmPopup_cpp = Module["__GLOBAL__sub_I_CPendingConfirmPopup_cpp"] = function() {
    return Module["asm"]["Ig"].apply(null, arguments)
};
var __GLOBAL__sub_I_CPlotAlerts_cpp = Module["__GLOBAL__sub_I_CPlotAlerts_cpp"] = function() {
    return Module["asm"]["Jg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CPlotDrawingsNew_cpp = Module["__GLOBAL__sub_I_CPlotDrawingsNew_cpp"] = function() {
    return Module["asm"]["Kg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CPlotMode_cpp = Module["__GLOBAL__sub_I_CPlotMode_cpp"] = function() {
    return Module["asm"]["Lg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CPlotNativeIndicators_cpp = Module["__GLOBAL__sub_I_CPlotNativeIndicators_cpp"] = function() {
    return Module["asm"]["Mg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CPlotNewSmartSeparator_cpp = Module["__GLOBAL__sub_I_CPlotNewSmartSeparator_cpp"] = function() {
    return Module["asm"]["Ng"].apply(null, arguments)
};
var __GLOBAL__sub_I_CPlotNew_cpp = Module["__GLOBAL__sub_I_CPlotNew_cpp"] = function() {
    return Module["asm"]["Og"].apply(null, arguments)
};
var __GLOBAL__sub_I_CPlotProfit_cpp = Module["__GLOBAL__sub_I_CPlotProfit_cpp"] = function() {
    return Module["asm"]["Pg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CPlotTab_cpp = Module["__GLOBAL__sub_I_CPlotTab_cpp"] = function() {
    return Module["asm"]["Qg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CPlotTimescale_cpp = Module["__GLOBAL__sub_I_CPlotTimescale_cpp"] = function() {
    return Module["asm"]["Rg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CPlotToolsPanel_cpp = Module["__GLOBAL__sub_I_CPlotToolsPanel_cpp"] = function() {
    return Module["asm"]["Sg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CPopupNotification_cpp = Module["__GLOBAL__sub_I_CPopupNotification_cpp"] = function() {
    return Module["asm"]["Tg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CPositionClosed_cpp = Module["__GLOBAL__sub_I_CPositionClosed_cpp"] = function() {
    return Module["asm"]["Ug"].apply(null, arguments)
};
var __GLOBAL__sub_I_CPositionOpened_cpp = Module["__GLOBAL__sub_I_CPositionOpened_cpp"] = function() {
    return Module["asm"]["Vg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CPriceMovementNotification_cpp = Module["__GLOBAL__sub_I_CPriceMovementNotification_cpp"] = function() {
    return Module["asm"]["Wg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CProfitLine_cpp = Module["__GLOBAL__sub_I_CProfitLine_cpp"] = function() {
    return Module["asm"]["Xg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CProfitLossPopup_cpp = Module["__GLOBAL__sub_I_CProfitLossPopup_cpp"] = function() {
    return Module["asm"]["Yg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CPurchaseConfirmPopup_cpp = Module["__GLOBAL__sub_I_CPurchaseConfirmPopup_cpp"] = function() {
    return Module["asm"]["Zg"].apply(null, arguments)
};
var __GLOBAL__sub_I_CRateManager_cpp = Module["__GLOBAL__sub_I_CRateManager_cpp"] = function() {
    return Module["asm"]["_g"].apply(null, arguments)
};
var __GLOBAL__sub_I_CSSTransition_cpp = Module["__GLOBAL__sub_I_CSSTransition_cpp"] = function() {
    return Module["asm"]["$g"].apply(null, arguments)
};
var __GLOBAL__sub_I_CScriptedIndicators_cpp = Module["__GLOBAL__sub_I_CScriptedIndicators_cpp"] = function() {
    return Module["asm"]["ah"].apply(null, arguments)
};
var __GLOBAL__sub_I_CSocialProfile_cpp = Module["__GLOBAL__sub_I_CSocialProfile_cpp"] = function() {
    return Module["asm"]["bh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CStockExpiration_cpp = Module["__GLOBAL__sub_I_CStockExpiration_cpp"] = function() {
    return Module["asm"]["ch"].apply(null, arguments)
};
var __GLOBAL__sub_I_CStockPlotMargin_cpp = Module["__GLOBAL__sub_I_CStockPlotMargin_cpp"] = function() {
    return Module["asm"]["dh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CStockProfitIndicator_cpp = Module["__GLOBAL__sub_I_CStockProfitIndicator_cpp"] = function() {
    return Module["asm"]["eh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CStockTrading_cpp = Module["__GLOBAL__sub_I_CStockTrading_cpp"] = function() {
    return Module["asm"]["fh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CStrikeDealIndication_cpp = Module["__GLOBAL__sub_I_CStrikeDealIndication_cpp"] = function() {
    return Module["asm"]["gh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CStrikeExpiration_cpp = Module["__GLOBAL__sub_I_CStrikeExpiration_cpp"] = function() {
    return Module["asm"]["hh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CStrikeRightPanel_cpp = Module["__GLOBAL__sub_I_CStrikeRightPanel_cpp"] = function() {
    return Module["asm"]["ih"].apply(null, arguments)
};
var __GLOBAL__sub_I_CStrikeTimescale_cpp = Module["__GLOBAL__sub_I_CStrikeTimescale_cpp"] = function() {
    return Module["asm"]["jh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CStrikeTrading_cpp = Module["__GLOBAL__sub_I_CStrikeTrading_cpp"] = function() {
    return Module["asm"]["kh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CStrikes_cpp = Module["__GLOBAL__sub_I_CStrikes_cpp"] = function() {
    return Module["asm"]["lh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CTournaments_cpp = Module["__GLOBAL__sub_I_CTournaments_cpp"] = function() {
    return Module["asm"]["mh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CTradersChoice_cpp = Module["__GLOBAL__sub_I_CTradersChoice_cpp"] = function() {
    return Module["asm"]["nh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CTradingHistory_cpp = Module["__GLOBAL__sub_I_CTradingHistory_cpp"] = function() {
    return Module["asm"]["oh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CUser_cpp = Module["__GLOBAL__sub_I_CUser_cpp"] = function() {
    return Module["asm"]["ph"].apply(null, arguments)
};
var __GLOBAL__sub_I_CVideoEducationPlayer_cpp = Module["__GLOBAL__sub_I_CVideoEducationPlayer_cpp"] = function() {
    return Module["asm"]["qh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CVideoEducation_cpp = Module["__GLOBAL__sub_I_CVideoEducation_cpp"] = function() {
    return Module["asm"]["rh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CViewDialogSettings_cpp = Module["__GLOBAL__sub_I_CViewDialogSettings_cpp"] = function() {
    return Module["asm"]["sh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CVipManagerProfile_cpp = Module["__GLOBAL__sub_I_CVipManagerProfile_cpp"] = function() {
    return Module["asm"]["th"].apply(null, arguments)
};
var __GLOBAL__sub_I_CVipManagerSelectScreen_cpp = Module["__GLOBAL__sub_I_CVipManagerSelectScreen_cpp"] = function() {
    return Module["asm"]["uh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CWebViewer_cpp = Module["__GLOBAL__sub_I_CWebViewer_cpp"] = function() {
    return Module["asm"]["vh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CWelcomeToDo_cpp = Module["__GLOBAL__sub_I_CWelcomeToDo_cpp"] = function() {
    return Module["asm"]["wh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CWidgets_cpp = Module["__GLOBAL__sub_I_CWidgets_cpp"] = function() {
    return Module["asm"]["xh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CalculationBaseInstrument_cpp = Module["__GLOBAL__sub_I_CalculationBaseInstrument_cpp"] = function() {
    return Module["asm"]["yh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CalculationPositionInstrumentBinary_cpp = Module["__GLOBAL__sub_I_CalculationPositionInstrumentBinary_cpp"] = function() {
    return Module["asm"]["zh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CalculationPositionInstrumentDigital_cpp = Module["__GLOBAL__sub_I_CalculationPositionInstrumentDigital_cpp"] = function() {
    return Module["asm"]["Ah"].apply(null, arguments)
};
var __GLOBAL__sub_I_CalculationPositionInstrumentFX_cpp = Module["__GLOBAL__sub_I_CalculationPositionInstrumentFX_cpp"] = function() {
    return Module["asm"]["Bh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CalculationPositionInstrument_cpp = Module["__GLOBAL__sub_I_CalculationPositionInstrument_cpp"] = function() {
    return Module["asm"]["Ch"].apply(null, arguments)
};
var __GLOBAL__sub_I_CalendarService_cpp = Module["__GLOBAL__sub_I_CalendarService_cpp"] = function() {
    return Module["asm"]["Dh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CandleDrawInfo_cpp = Module["__GLOBAL__sub_I_CandleDrawInfo_cpp"] = function() {
    return Module["asm"]["Eh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CandleValueGetter_cpp = Module["__GLOBAL__sub_I_CandleValueGetter_cpp"] = function() {
    return Module["asm"]["Fh"].apply(null, arguments)
};
var __GLOBAL__sub_I_Canvas_cpp = Module["__GLOBAL__sub_I_Canvas_cpp"] = function() {
    return Module["asm"]["Gh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CashBalanceListFactory_cpp = Module["__GLOBAL__sub_I_CashBalanceListFactory_cpp"] = function() {
    return Module["asm"]["Hh"].apply(null, arguments)
};
var __GLOBAL__sub_I_ChartEvents_cpp = Module["__GLOBAL__sub_I_ChartEvents_cpp"] = function() {
    return Module["asm"]["Ih"].apply(null, arguments)
};
var __GLOBAL__sub_I_ChooseDigitalsType_cpp = Module["__GLOBAL__sub_I_ChooseDigitalsType_cpp"] = function() {
    return Module["asm"]["Jh"].apply(null, arguments)
};
var __GLOBAL__sub_I_ColorPicker_cpp = Module["__GLOBAL__sub_I_ColorPicker_cpp"] = function() {
    return Module["asm"]["Kh"].apply(null, arguments)
};
var __GLOBAL__sub_I_Color_cpp = Module["__GLOBAL__sub_I_Color_cpp"] = function() {
    return Module["asm"]["Lh"].apply(null, arguments)
};
var __GLOBAL__sub_I_ComboBoxLineWidth_cpp = Module["__GLOBAL__sub_I_ComboBoxLineWidth_cpp"] = function() {
    return Module["asm"]["Mh"].apply(null, arguments)
};
var __GLOBAL__sub_I_ComboBoxShapeStyle_cpp = Module["__GLOBAL__sub_I_ComboBoxShapeStyle_cpp"] = function() {
    return Module["asm"]["Nh"].apply(null, arguments)
};
var __GLOBAL__sub_I_ComboBoxWrap_cpp = Module["__GLOBAL__sub_I_ComboBoxWrap_cpp"] = function() {
    return Module["asm"]["Oh"].apply(null, arguments)
};
var __GLOBAL__sub_I_ComboBox_cpp = Module["__GLOBAL__sub_I_ComboBox_cpp"] = function() {
    return Module["asm"]["Ph"].apply(null, arguments)
};
var __GLOBAL__sub_I_ComplexTimeSelector_cpp = Module["__GLOBAL__sub_I_ComplexTimeSelector_cpp"] = function() {
    return Module["asm"]["Qh"].apply(null, arguments)
};
var __GLOBAL__sub_I_ConfirmPopupExchangeState_cpp = Module["__GLOBAL__sub_I_ConfirmPopupExchangeState_cpp"] = function() {
    return Module["asm"]["Rh"].apply(null, arguments)
};
var __GLOBAL__sub_I_CustomContextMenu_cpp = Module["__GLOBAL__sub_I_CustomContextMenu_cpp"] = function() {
    return Module["asm"]["Sh"].apply(null, arguments)
};
var __GLOBAL__sub_I_DealBase_cpp = Module["__GLOBAL__sub_I_DealBase_cpp"] = function() {
    return Module["asm"]["Th"].apply(null, arguments)
};
var __GLOBAL__sub_I_DealBinary_cpp = Module["__GLOBAL__sub_I_DealBinary_cpp"] = function() {
    return Module["asm"]["Uh"].apply(null, arguments)
};
var __GLOBAL__sub_I_DealInfoItemWrapBase_cpp = Module["__GLOBAL__sub_I_DealInfoItemWrapBase_cpp"] = function() {
    return Module["asm"]["Vh"].apply(null, arguments)
};
var __GLOBAL__sub_I_DealInfoItemWrapBinary_cpp = Module["__GLOBAL__sub_I_DealInfoItemWrapBinary_cpp"] = function() {
    return Module["asm"]["Wh"].apply(null, arguments)
};
var __GLOBAL__sub_I_DealInfoItemWrapMarginalStock_cpp = Module["__GLOBAL__sub_I_DealInfoItemWrapMarginalStock_cpp"] = function() {
    return Module["asm"]["Xh"].apply(null, arguments)
};
var __GLOBAL__sub_I_DealInfoItemWrapStock_cpp = Module["__GLOBAL__sub_I_DealInfoItemWrapStock_cpp"] = function() {
    return Module["asm"]["Yh"].apply(null, arguments)
};
var __GLOBAL__sub_I_DealInfoItemWrapStrike_cpp = Module["__GLOBAL__sub_I_DealInfoItemWrapStrike_cpp"] = function() {
    return Module["asm"]["Zh"].apply(null, arguments)
};
var __GLOBAL__sub_I_DealInfoPlot_cpp = Module["__GLOBAL__sub_I_DealInfoPlot_cpp"] = function() {
    return Module["asm"]["_h"].apply(null, arguments)
};
var __GLOBAL__sub_I_DealOrder_cpp = Module["__GLOBAL__sub_I_DealOrder_cpp"] = function() {
    return Module["asm"]["$h"].apply(null, arguments)
};
var __GLOBAL__sub_I_DealPosition_cpp = Module["__GLOBAL__sub_I_DealPosition_cpp"] = function() {
    return Module["asm"]["ai"].apply(null, arguments)
};
var __GLOBAL__sub_I_DealsBottomPortfolioViewModel_cpp = Module["__GLOBAL__sub_I_DealsBottomPortfolioViewModel_cpp"] = function() {
    return Module["asm"]["bi"].apply(null, arguments)
};
var __GLOBAL__sub_I_DealsCommands_cpp = Module["__GLOBAL__sub_I_DealsCommands_cpp"] = function() {
    return Module["asm"]["ci"].apply(null, arguments)
};
var __GLOBAL__sub_I_DealsContainer_cpp = Module["__GLOBAL__sub_I_DealsContainer_cpp"] = function() {
    return Module["asm"]["di"].apply(null, arguments)
};
var __GLOBAL__sub_I_DealsEvents_cpp = Module["__GLOBAL__sub_I_DealsEvents_cpp"] = function() {
    return Module["asm"]["ei"].apply(null, arguments)
};
var __GLOBAL__sub_I_DealsGeneral_cpp = Module["__GLOBAL__sub_I_DealsGeneral_cpp"] = function() {
    return Module["asm"]["fi"].apply(null, arguments)
};
var __GLOBAL__sub_I_DealsHistoryViewModel_cpp = Module["__GLOBAL__sub_I_DealsHistoryViewModel_cpp"] = function() {
    return Module["asm"]["gi"].apply(null, arguments)
};
var __GLOBAL__sub_I_DealsResponseParse_cpp = Module["__GLOBAL__sub_I_DealsResponseParse_cpp"] = function() {
    return Module["asm"]["hi"].apply(null, arguments)
};
var __GLOBAL__sub_I_DealsService_cpp = Module["__GLOBAL__sub_I_DealsService_cpp"] = function() {
    return Module["asm"]["ii"].apply(null, arguments)
};
var __GLOBAL__sub_I_Debug_cpp = Module["__GLOBAL__sub_I_Debug_cpp"] = function() {
    return Module["asm"]["ji"].apply(null, arguments)
};
var __GLOBAL__sub_I_DeepLinkService_cpp = Module["__GLOBAL__sub_I_DeepLinkService_cpp"] = function() {
    return Module["asm"]["ki"].apply(null, arguments)
};
var __GLOBAL__sub_I_DefaultExchangeMode_cpp = Module["__GLOBAL__sub_I_DefaultExchangeMode_cpp"] = function() {
    return Module["asm"]["li"].apply(null, arguments)
};
var __GLOBAL__sub_I_DigitalTradeService_cpp = Module["__GLOBAL__sub_I_DigitalTradeService_cpp"] = function() {
    return Module["asm"]["mi"].apply(null, arguments)
};
var __GLOBAL__sub_I_DockPanel_cpp = Module["__GLOBAL__sub_I_DockPanel_cpp"] = function() {
    return Module["asm"]["ni"].apply(null, arguments)
};
var __GLOBAL__sub_I_DragAndDrop_cpp = Module["__GLOBAL__sub_I_DragAndDrop_cpp"] = function() {
    return Module["asm"]["oi"].apply(null, arguments)
};
var __GLOBAL__sub_I_EventInfo_cpp = Module["__GLOBAL__sub_I_EventInfo_cpp"] = function() {
    return Module["asm"]["pi"].apply(null, arguments)
};
var __GLOBAL__sub_I_ExchangeRatesService_cpp = Module["__GLOBAL__sub_I_ExchangeRatesService_cpp"] = function() {
    return Module["asm"]["qi"].apply(null, arguments)
};
var __GLOBAL__sub_I_ExchangeService_cpp = Module["__GLOBAL__sub_I_ExchangeService_cpp"] = function() {
    return Module["asm"]["ri"].apply(null, arguments)
};
var __GLOBAL__sub_I_FXTradeService_cpp = Module["__GLOBAL__sub_I_FXTradeService_cpp"] = function() {
    return Module["asm"]["si"].apply(null, arguments)
};
var __GLOBAL__sub_I_GDPRService_cpp = Module["__GLOBAL__sub_I_GDPRService_cpp"] = function() {
    return Module["asm"]["ti"].apply(null, arguments)
};
var __GLOBAL__sub_I_GifMediaPlayer_cpp = Module["__GLOBAL__sub_I_GifMediaPlayer_cpp"] = function() {
    return Module["asm"]["ui"].apply(null, arguments)
};
var __GLOBAL__sub_I_GridTabsController_cpp = Module["__GLOBAL__sub_I_GridTabsController_cpp"] = function() {
    return Module["asm"]["vi"].apply(null, arguments)
};
var __GLOBAL__sub_I_HorizontalWeekSelector_cpp = Module["__GLOBAL__sub_I_HorizontalWeekSelector_cpp"] = function() {
    return Module["asm"]["wi"].apply(null, arguments)
};
var __GLOBAL__sub_I_HtmlCssIQStyle_cpp = Module["__GLOBAL__sub_I_HtmlCssIQStyle_cpp"] = function() {
    return Module["asm"]["xi"].apply(null, arguments)
};
var __GLOBAL__sub_I_HtmlCssTagStylesDefault_cpp = Module["__GLOBAL__sub_I_HtmlCssTagStylesDefault_cpp"] = function() {
    return Module["asm"]["yi"].apply(null, arguments)
};
var __GLOBAL__sub_I_HtmlCssTagStylesHover_cpp = Module["__GLOBAL__sub_I_HtmlCssTagStylesHover_cpp"] = function() {
    return Module["asm"]["zi"].apply(null, arguments)
};
var __GLOBAL__sub_I_HtmlCssValues_cpp = Module["__GLOBAL__sub_I_HtmlCssValues_cpp"] = function() {
    return Module["asm"]["Ai"].apply(null, arguments)
};
var __GLOBAL__sub_I_HtmlCursor_cpp = Module["__GLOBAL__sub_I_HtmlCursor_cpp"] = function() {
    return Module["asm"]["Bi"].apply(null, arguments)
};
var __GLOBAL__sub_I_HtmlEvent_cpp = Module["__GLOBAL__sub_I_HtmlEvent_cpp"] = function() {
    return Module["asm"]["Ci"].apply(null, arguments)
};
var __GLOBAL__sub_I_HtmlFontSettings_cpp = Module["__GLOBAL__sub_I_HtmlFontSettings_cpp"] = function() {
    return Module["asm"]["Di"].apply(null, arguments)
};
var __GLOBAL__sub_I_HtmlLayout_cpp = Module["__GLOBAL__sub_I_HtmlLayout_cpp"] = function() {
    return Module["asm"]["Ei"].apply(null, arguments)
};
var __GLOBAL__sub_I_HtmlLineSettings_cpp = Module["__GLOBAL__sub_I_HtmlLineSettings_cpp"] = function() {
    return Module["asm"]["Fi"].apply(null, arguments)
};
var __GLOBAL__sub_I_HtmlListSettings_cpp = Module["__GLOBAL__sub_I_HtmlListSettings_cpp"] = function() {
    return Module["asm"]["Gi"].apply(null, arguments)
};
var __GLOBAL__sub_I_HtmlParser_cpp = Module["__GLOBAL__sub_I_HtmlParser_cpp"] = function() {
    return Module["asm"]["Hi"].apply(null, arguments)
};
var __GLOBAL__sub_I_HtmlPrint_cpp = Module["__GLOBAL__sub_I_HtmlPrint_cpp"] = function() {
    return Module["asm"]["Ii"].apply(null, arguments)
};
var __GLOBAL__sub_I_HtmlRenderer_cpp = Module["__GLOBAL__sub_I_HtmlRenderer_cpp"] = function() {
    return Module["asm"]["Ji"].apply(null, arguments)
};
var __GLOBAL__sub_I_HtmlStyleEdge_cpp = Module["__GLOBAL__sub_I_HtmlStyleEdge_cpp"] = function() {
    return Module["asm"]["Ki"].apply(null, arguments)
};
var __GLOBAL__sub_I_HtmlStyleRect_cpp = Module["__GLOBAL__sub_I_HtmlStyleRect_cpp"] = function() {
    return Module["asm"]["Li"].apply(null, arguments)
};
var __GLOBAL__sub_I_HtmlTagBase_cpp = Module["__GLOBAL__sub_I_HtmlTagBase_cpp"] = function() {
    return Module["asm"]["Mi"].apply(null, arguments)
};
var __GLOBAL__sub_I_HtmlTagMedia_cpp = Module["__GLOBAL__sub_I_HtmlTagMedia_cpp"] = function() {
    return Module["asm"]["Ni"].apply(null, arguments)
};
var __GLOBAL__sub_I_HtmlTagStyleClass_cpp = Module["__GLOBAL__sub_I_HtmlTagStyleClass_cpp"] = function() {
    return Module["asm"]["Oi"].apply(null, arguments)
};
var __GLOBAL__sub_I_HtmlTextAlign_cpp = Module["__GLOBAL__sub_I_HtmlTextAlign_cpp"] = function() {
    return Module["asm"]["Pi"].apply(null, arguments)
};
var __GLOBAL__sub_I_HtmlUtils_cpp = Module["__GLOBAL__sub_I_HtmlUtils_cpp"] = function() {
    return Module["asm"]["Qi"].apply(null, arguments)
};
var __GLOBAL__sub_I_HtmlVerticalAlign_cpp = Module["__GLOBAL__sub_I_HtmlVerticalAlign_cpp"] = function() {
    return Module["asm"]["Ri"].apply(null, arguments)
};
var __GLOBAL__sub_I_HtmlWordSettings_cpp = Module["__GLOBAL__sub_I_HtmlWordSettings_cpp"] = function() {
    return Module["asm"]["Si"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQActiveCategory_cpp = Module["__GLOBAL__sub_I_IQActiveCategory_cpp"] = function() {
    return Module["asm"]["Ti"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQAnalyticEvent_cpp = Module["__GLOBAL__sub_I_IQAnalyticEvent_cpp"] = function() {
    return Module["asm"]["Ui"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQAnalytics_cpp = Module["__GLOBAL__sub_I_IQAnalytics_cpp"] = function() {
    return Module["asm"]["Vi"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQAppConfig_cpp = Module["__GLOBAL__sub_I_IQAppConfig_cpp"] = function() {
    return Module["asm"]["Wi"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQBasePositionInstrument_cpp = Module["__GLOBAL__sub_I_IQBasePositionInstrument_cpp"] = function() {
    return Module["asm"]["Xi"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQBet_cpp = Module["__GLOBAL__sub_I_IQBet_cpp"] = function() {
    return Module["asm"]["Yi"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQBilling_cpp = Module["__GLOBAL__sub_I_IQBilling_cpp"] = function() {
    return Module["asm"]["Zi"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQBusCommand_cpp = Module["__GLOBAL__sub_I_IQBusCommand_cpp"] = function() {
    return Module["asm"]["_i"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQCommandBilling_cpp = Module["__GLOBAL__sub_I_IQCommandBilling_cpp"] = function() {
    return Module["asm"]["$i"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQCommandTradeRoom_cpp = Module["__GLOBAL__sub_I_IQCommandTradeRoom_cpp"] = function() {
    return Module["asm"]["aj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQCommandTrading_cpp = Module["__GLOBAL__sub_I_IQCommandTrading_cpp"] = function() {
    return Module["asm"]["bj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQCommandUser_cpp = Module["__GLOBAL__sub_I_IQCommandUser_cpp"] = function() {
    return Module["asm"]["cj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQCommand_cpp = Module["__GLOBAL__sub_I_IQCommand_cpp"] = function() {
    return Module["asm"]["dj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQDrawingsManager_cpp = Module["__GLOBAL__sub_I_IQDrawingsManager_cpp"] = function() {
    return Module["asm"]["ej"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQModelCacheBase_cpp = Module["__GLOBAL__sub_I_IQModelCacheBase_cpp"] = function() {
    return Module["asm"]["fj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQModelCacheBilling_cpp = Module["__GLOBAL__sub_I_IQModelCacheBilling_cpp"] = function() {
    return Module["asm"]["gj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQModelCacheChat_cpp = Module["__GLOBAL__sub_I_IQModelCacheChat_cpp"] = function() {
    return Module["asm"]["hj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQModelCacheFeatureToggling_cpp = Module["__GLOBAL__sub_I_IQModelCacheFeatureToggling_cpp"] = function() {
    return Module["asm"]["ij"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQModelCacheInstruments_cpp = Module["__GLOBAL__sub_I_IQModelCacheInstruments_cpp"] = function() {
    return Module["asm"]["jj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQModelCacheTrading_cpp = Module["__GLOBAL__sub_I_IQModelCacheTrading_cpp"] = function() {
    return Module["asm"]["kj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQModelCache_cpp = Module["__GLOBAL__sub_I_IQModelCache_cpp"] = function() {
    return Module["asm"]["lj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQModelCommand_cpp = Module["__GLOBAL__sub_I_IQModelCommand_cpp"] = function() {
    return Module["asm"]["mj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQModelQueryBase_cpp = Module["__GLOBAL__sub_I_IQModelQueryBase_cpp"] = function() {
    return Module["asm"]["nj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQModelQueryBilling_cpp = Module["__GLOBAL__sub_I_IQModelQueryBilling_cpp"] = function() {
    return Module["asm"]["oj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQModelQueryCFD_cpp = Module["__GLOBAL__sub_I_IQModelQueryCFD_cpp"] = function() {
    return Module["asm"]["pj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQModelQueryChat_cpp = Module["__GLOBAL__sub_I_IQModelQueryChat_cpp"] = function() {
    return Module["asm"]["qj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQModelQueryDealInfo_cpp = Module["__GLOBAL__sub_I_IQModelQueryDealInfo_cpp"] = function() {
    return Module["asm"]["rj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQModelQueryFeatureToggling_cpp = Module["__GLOBAL__sub_I_IQModelQueryFeatureToggling_cpp"] = function() {
    return Module["asm"]["sj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQModelQueryOrderBook_cpp = Module["__GLOBAL__sub_I_IQModelQueryOrderBook_cpp"] = function() {
    return Module["asm"]["tj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQModelQueryTrading_cpp = Module["__GLOBAL__sub_I_IQModelQueryTrading_cpp"] = function() {
    return Module["asm"]["uj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQModelQuery_cpp = Module["__GLOBAL__sub_I_IQModelQuery_cpp"] = function() {
    return Module["asm"]["vj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQPlot_cpp = Module["__GLOBAL__sub_I_IQPlot_cpp"] = function() {
    return Module["asm"]["wj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQPositionContainer_cpp = Module["__GLOBAL__sub_I_IQPositionContainer_cpp"] = function() {
    return Module["asm"]["xj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQPosition_cpp = Module["__GLOBAL__sub_I_IQPosition_cpp"] = function() {
    return Module["asm"]["yj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQTimeStats_cpp = Module["__GLOBAL__sub_I_IQTimeStats_cpp"] = function() {
    return Module["asm"]["zj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQTimepoint_cpp = Module["__GLOBAL__sub_I_IQTimepoint_cpp"] = function() {
    return Module["asm"]["Aj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQTournament_cpp = Module["__GLOBAL__sub_I_IQTournament_cpp"] = function() {
    return Module["asm"]["Bj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewActiveHeaderColumns_cpp = Module["__GLOBAL__sub_I_IQViewActiveHeaderColumns_cpp"] = function() {
    return Module["asm"]["Cj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewActiveSelectorItem_cpp = Module["__GLOBAL__sub_I_IQViewActiveSelectorItem_cpp"] = function() {
    return Module["asm"]["Dj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewActiveSelector_cpp = Module["__GLOBAL__sub_I_IQViewActiveSelector_cpp"] = function() {
    return Module["asm"]["Ej"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewAmountSelector_cpp = Module["__GLOBAL__sub_I_IQViewAmountSelector_cpp"] = function() {
    return Module["asm"]["Fj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewAssetElement_cpp = Module["__GLOBAL__sub_I_IQViewAssetElement_cpp"] = function() {
    return Module["asm"]["Gj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewAssetInfo_cpp = Module["__GLOBAL__sub_I_IQViewAssetInfo_cpp"] = function() {
    return Module["asm"]["Hj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewAssetProfile_cpp = Module["__GLOBAL__sub_I_IQViewAssetProfile_cpp"] = function() {
    return Module["asm"]["Ij"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewAssetSchedule_cpp = Module["__GLOBAL__sub_I_IQViewAssetSchedule_cpp"] = function() {
    return Module["asm"]["Jj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewAutomarginPopup_cpp = Module["__GLOBAL__sub_I_IQViewAutomarginPopup_cpp"] = function() {
    return Module["asm"]["Kj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewBalanceElement_cpp = Module["__GLOBAL__sub_I_IQViewBalanceElement_cpp"] = function() {
    return Module["asm"]["Lj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewBigBuyBackPopup_cpp = Module["__GLOBAL__sub_I_IQViewBigBuyBackPopup_cpp"] = function() {
    return Module["asm"]["Mj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewBigClosePositionPopup_cpp = Module["__GLOBAL__sub_I_IQViewBigClosePositionPopup_cpp"] = function() {
    return Module["asm"]["Nj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewBigOrdersPopup_cpp = Module["__GLOBAL__sub_I_IQViewBigOrdersPopup_cpp"] = function() {
    return Module["asm"]["Oj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewBinaryDealGroup_cpp = Module["__GLOBAL__sub_I_IQViewBinaryDealGroup_cpp"] = function() {
    return Module["asm"]["Pj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewBinaryDeal_cpp = Module["__GLOBAL__sub_I_IQViewBinaryDeal_cpp"] = function() {
    return Module["asm"]["Qj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewCFDInfoPanel_cpp = Module["__GLOBAL__sub_I_IQViewCFDInfoPanel_cpp"] = function() {
    return Module["asm"]["Rj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewCFDPlotElements_cpp = Module["__GLOBAL__sub_I_IQViewCFDPlotElements_cpp"] = function() {
    return Module["asm"]["Sj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewCFDPlotIndication_cpp = Module["__GLOBAL__sub_I_IQViewCFDPlotIndication_cpp"] = function() {
    return Module["asm"]["Tj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewCFDRightPanel_cpp = Module["__GLOBAL__sub_I_IQViewCFDRightPanel_cpp"] = function() {
    return Module["asm"]["Uj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewCalculator_cpp = Module["__GLOBAL__sub_I_IQViewCalculator_cpp"] = function() {
    return Module["asm"]["Vj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewCalendarListItem_cpp = Module["__GLOBAL__sub_I_IQViewCalendarListItem_cpp"] = function() {
    return Module["asm"]["Wj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewChatAttachmentDropdown_cpp = Module["__GLOBAL__sub_I_IQViewChatAttachmentDropdown_cpp"] = function() {
    return Module["asm"]["Xj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewChatModeration_cpp = Module["__GLOBAL__sub_I_IQViewChatModeration_cpp"] = function() {
    return Module["asm"]["Yj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewCommissionsFeeInfo_cpp = Module["__GLOBAL__sub_I_IQViewCommissionsFeeInfo_cpp"] = function() {
    return Module["asm"]["Zj"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewCommonConfirmPopup_cpp = Module["__GLOBAL__sub_I_IQViewCommonConfirmPopup_cpp"] = function() {
    return Module["asm"]["_j"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewCommonPlotElements_cpp = Module["__GLOBAL__sub_I_IQViewCommonPlotElements_cpp"] = function() {
    return Module["asm"]["$j"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewCryptoCalendarEventInfo_cpp = Module["__GLOBAL__sub_I_IQViewCryptoCalendarEventInfo_cpp"] = function() {
    return Module["asm"]["ak"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewDealsGroupInfoFactorys_cpp = Module["__GLOBAL__sub_I_IQViewDealsGroupInfoFactorys_cpp"] = function() {
    return Module["asm"]["bk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewDepositAmountElement_cpp = Module["__GLOBAL__sub_I_IQViewDepositAmountElement_cpp"] = function() {
    return Module["asm"]["ck"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewDepositBoletoForm_cpp = Module["__GLOBAL__sub_I_IQViewDepositBoletoForm_cpp"] = function() {
    return Module["asm"]["dk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewDepositCardForm_cpp = Module["__GLOBAL__sub_I_IQViewDepositCardForm_cpp"] = function() {
    return Module["asm"]["ek"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewDepositCompact_cpp = Module["__GLOBAL__sub_I_IQViewDepositCompact_cpp"] = function() {
    return Module["asm"]["fk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewDepositDefaultForm_cpp = Module["__GLOBAL__sub_I_IQViewDepositDefaultForm_cpp"] = function() {
    return Module["asm"]["gk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewDepositFormBase_cpp = Module["__GLOBAL__sub_I_IQViewDepositFormBase_cpp"] = function() {
    return Module["asm"]["hk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewDepositFormFieldBase_cpp = Module["__GLOBAL__sub_I_IQViewDepositFormFieldBase_cpp"] = function() {
    return Module["asm"]["ik"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewDepositFormFieldTextBox_cpp = Module["__GLOBAL__sub_I_IQViewDepositFormFieldTextBox_cpp"] = function() {
    return Module["asm"]["jk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewDepositPaymentElement_cpp = Module["__GLOBAL__sub_I_IQViewDepositPaymentElement_cpp"] = function() {
    return Module["asm"]["kk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewDepositUtils_cpp = Module["__GLOBAL__sub_I_IQViewDepositUtils_cpp"] = function() {
    return Module["asm"]["lk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewDepositV3_cpp = Module["__GLOBAL__sub_I_IQViewDepositV3_cpp"] = function() {
    return Module["asm"]["mk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewDepositVipElement_cpp = Module["__GLOBAL__sub_I_IQViewDepositVipElement_cpp"] = function() {
    return Module["asm"]["nk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewDialogPopup_cpp = Module["__GLOBAL__sub_I_IQViewDialogPopup_cpp"] = function() {
    return Module["asm"]["ok"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewDigitalBigBuyBackPopup_cpp = Module["__GLOBAL__sub_I_IQViewDigitalBigBuyBackPopup_cpp"] = function() {
    return Module["asm"]["pk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewDigitalDealGroup_cpp = Module["__GLOBAL__sub_I_IQViewDigitalDealGroup_cpp"] = function() {
    return Module["asm"]["qk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewDigitalDeal_cpp = Module["__GLOBAL__sub_I_IQViewDigitalDeal_cpp"] = function() {
    return Module["asm"]["rk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewDigitalSelectStrikes_cpp = Module["__GLOBAL__sub_I_IQViewDigitalSelectStrikes_cpp"] = function() {
    return Module["asm"]["sk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewDigitalSelectTime_cpp = Module["__GLOBAL__sub_I_IQViewDigitalSelectTime_cpp"] = function() {
    return Module["asm"]["tk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewEconomicCalendarEventInfo_cpp = Module["__GLOBAL__sub_I_IQViewEconomicCalendarEventInfo_cpp"] = function() {
    return Module["asm"]["uk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewExchangeInfoPanel_cpp = Module["__GLOBAL__sub_I_IQViewExchangeInfoPanel_cpp"] = function() {
    return Module["asm"]["vk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewExchangeRightPanel_cpp = Module["__GLOBAL__sub_I_IQViewExchangeRightPanel_cpp"] = function() {
    return Module["asm"]["wk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewExpBalloon_cpp = Module["__GLOBAL__sub_I_IQViewExpBalloon_cpp"] = function() {
    return Module["asm"]["xk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewExpiration_cpp = Module["__GLOBAL__sub_I_IQViewExpiration_cpp"] = function() {
    return Module["asm"]["yk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewFastDeposit_cpp = Module["__GLOBAL__sub_I_IQViewFastDeposit_cpp"] = function() {
    return Module["asm"]["zk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewFormatter_cpp = Module["__GLOBAL__sub_I_IQViewFormatter_cpp"] = function() {
    return Module["asm"]["Ak"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewFullscreenPopup_cpp = Module["__GLOBAL__sub_I_IQViewFullscreenPopup_cpp"] = function() {
    return Module["asm"]["Bk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewGridItemHolder_cpp = Module["__GLOBAL__sub_I_IQViewGridItemHolder_cpp"] = function() {
    return Module["asm"]["Ck"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewGridOfViews_cpp = Module["__GLOBAL__sub_I_IQViewGridOfViews_cpp"] = function() {
    return Module["asm"]["Dk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewGridTab_cpp = Module["__GLOBAL__sub_I_IQViewGridTab_cpp"] = function() {
    return Module["asm"]["Ek"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewHistoryDealInfoMarginal_cpp = Module["__GLOBAL__sub_I_IQViewHistoryDealInfoMarginal_cpp"] = function() {
    return Module["asm"]["Fk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewHistoryDealInfo_cpp = Module["__GLOBAL__sub_I_IQViewHistoryDealInfo_cpp"] = function() {
    return Module["asm"]["Gk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewIndicatorDialog_cpp = Module["__GLOBAL__sub_I_IQViewIndicatorDialog_cpp"] = function() {
    return Module["asm"]["Hk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewLeaderboardNotification_cpp = Module["__GLOBAL__sub_I_IQViewLeaderboardNotification_cpp"] = function() {
    return Module["asm"]["Ik"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewLeaderboardTopAmounts_cpp = Module["__GLOBAL__sub_I_IQViewLeaderboardTopAmounts_cpp"] = function() {
    return Module["asm"]["Jk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewLeftPanelLeaderboard_cpp = Module["__GLOBAL__sub_I_IQViewLeftPanelLeaderboard_cpp"] = function() {
    return Module["asm"]["Kk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewLeftPanelTab_cpp = Module["__GLOBAL__sub_I_IQViewLeftPanelTab_cpp"] = function() {
    return Module["asm"]["Lk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewManager_cpp = Module["__GLOBAL__sub_I_IQViewManager_cpp"] = function() {
    return Module["asm"]["Mk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewMarketAnalysisItemAssetProfile_cpp = Module["__GLOBAL__sub_I_IQViewMarketAnalysisItemAssetProfile_cpp"] = function() {
    return Module["asm"]["Nk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewMarketAnalysisItemDashboard_cpp = Module["__GLOBAL__sub_I_IQViewMarketAnalysisItemDashboard_cpp"] = function() {
    return Module["asm"]["Ok"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewMicroBuyBackPopup_cpp = Module["__GLOBAL__sub_I_IQViewMicroBuyBackPopup_cpp"] = function() {
    return Module["asm"]["Pk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewNewsItem_cpp = Module["__GLOBAL__sub_I_IQViewNewsItem_cpp"] = function() {
    return Module["asm"]["Qk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewOpenPositionNotification_cpp = Module["__GLOBAL__sub_I_IQViewOpenPositionNotification_cpp"] = function() {
    return Module["asm"]["Rk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewOptionRightPanel_cpp = Module["__GLOBAL__sub_I_IQViewOptionRightPanel_cpp"] = function() {
    return Module["asm"]["Sk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewOvernightScheduleInfo_cpp = Module["__GLOBAL__sub_I_IQViewOvernightScheduleInfo_cpp"] = function() {
    return Module["asm"]["Tk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewPartialCloseDialog_cpp = Module["__GLOBAL__sub_I_IQViewPartialCloseDialog_cpp"] = function() {
    return Module["asm"]["Uk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewPendingConfirmPopup_cpp = Module["__GLOBAL__sub_I_IQViewPendingConfirmPopup_cpp"] = function() {
    return Module["asm"]["Vk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewPlotBubble_cpp = Module["__GLOBAL__sub_I_IQViewPlotBubble_cpp"] = function() {
    return Module["asm"]["Wk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewPlotNew_cpp = Module["__GLOBAL__sub_I_IQViewPlotNew_cpp"] = function() {
    return Module["asm"]["Xk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewPlotOrder_cpp = Module["__GLOBAL__sub_I_IQViewPlotOrder_cpp"] = function() {
    return Module["asm"]["Yk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewPlotProfit_cpp = Module["__GLOBAL__sub_I_IQViewPlotProfit_cpp"] = function() {
    return Module["asm"]["Zk"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewPopupCommissionBlock_cpp = Module["__GLOBAL__sub_I_IQViewPopupCommissionBlock_cpp"] = function() {
    return Module["asm"]["_k"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewPopupNotification_cpp = Module["__GLOBAL__sub_I_IQViewPopupNotification_cpp"] = function() {
    return Module["asm"]["$k"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewPriceMovementNotification_cpp = Module["__GLOBAL__sub_I_IQViewPriceMovementNotification_cpp"] = function() {
    return Module["asm"]["al"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewPriceMovement_cpp = Module["__GLOBAL__sub_I_IQViewPriceMovement_cpp"] = function() {
    return Module["asm"]["bl"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewProfitIndicator_cpp = Module["__GLOBAL__sub_I_IQViewProfitIndicator_cpp"] = function() {
    return Module["asm"]["cl"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewProfitLossPopup_cpp = Module["__GLOBAL__sub_I_IQViewProfitLossPopup_cpp"] = function() {
    return Module["asm"]["dl"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewPurchaseConfirmPopup_cpp = Module["__GLOBAL__sub_I_IQViewPurchaseConfirmPopup_cpp"] = function() {
    return Module["asm"]["el"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewScriptedIndicatorsPanel_cpp = Module["__GLOBAL__sub_I_IQViewScriptedIndicatorsPanel_cpp"] = function() {
    return Module["asm"]["fl"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewSelectTime_cpp = Module["__GLOBAL__sub_I_IQViewSelectTime_cpp"] = function() {
    return Module["asm"]["gl"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewSmallBuyBackPopup_cpp = Module["__GLOBAL__sub_I_IQViewSmallBuyBackPopup_cpp"] = function() {
    return Module["asm"]["hl"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewSmallClosePosition_cpp = Module["__GLOBAL__sub_I_IQViewSmallClosePosition_cpp"] = function() {
    return Module["asm"]["il"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewStockPlotMargin_cpp = Module["__GLOBAL__sub_I_IQViewStockPlotMargin_cpp"] = function() {
    return Module["asm"]["jl"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewStrikeHidden_cpp = Module["__GLOBAL__sub_I_IQViewStrikeHidden_cpp"] = function() {
    return Module["asm"]["kl"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewStrikePlotElements_cpp = Module["__GLOBAL__sub_I_IQViewStrikePlotElements_cpp"] = function() {
    return Module["asm"]["ll"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewStrikesPopup_cpp = Module["__GLOBAL__sub_I_IQViewStrikesPopup_cpp"] = function() {
    return Module["asm"]["ml"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewStrikes_cpp = Module["__GLOBAL__sub_I_IQViewStrikes_cpp"] = function() {
    return Module["asm"]["nl"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewStyles_cpp = Module["__GLOBAL__sub_I_IQViewStyles_cpp"] = function() {
    return Module["asm"]["ol"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewTemplatesPanel_cpp = Module["__GLOBAL__sub_I_IQViewTemplatesPanel_cpp"] = function() {
    return Module["asm"]["pl"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewTpslCombobox_cpp = Module["__GLOBAL__sub_I_IQViewTpslCombobox_cpp"] = function() {
    return Module["asm"]["ql"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewTradingHistoryFactorys_cpp = Module["__GLOBAL__sub_I_IQViewTradingHistoryFactorys_cpp"] = function() {
    return Module["asm"]["rl"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewTradingHistory_cpp = Module["__GLOBAL__sub_I_IQViewTradingHistory_cpp"] = function() {
    return Module["asm"]["sl"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewVideoEducation_cpp = Module["__GLOBAL__sub_I_IQViewVideoEducation_cpp"] = function() {
    return Module["asm"]["tl"].apply(null, arguments)
};
var __GLOBAL__sub_I_IQViewWelcomeToDo_cpp = Module["__GLOBAL__sub_I_IQViewWelcomeToDo_cpp"] = function() {
    return Module["asm"]["ul"].apply(null, arguments)
};
var __GLOBAL__sub_I_ImageLoader_cpp = Module["__GLOBAL__sub_I_ImageLoader_cpp"] = function() {
    return Module["asm"]["vl"].apply(null, arguments)
};
var __GLOBAL__sub_I_ImageUrl_cpp = Module["__GLOBAL__sub_I_ImageUrl_cpp"] = function() {
    return Module["asm"]["wl"].apply(null, arguments)
};
var __GLOBAL__sub_I_IndicatorPlotStyleSelector_cpp = Module["__GLOBAL__sub_I_IndicatorPlotStyleSelector_cpp"] = function() {
    return Module["asm"]["xl"].apply(null, arguments)
};
var __GLOBAL__sub_I_InstrumentDataAORenderer_cpp = Module["__GLOBAL__sub_I_InstrumentDataAORenderer_cpp"] = function() {
    return Module["asm"]["yl"].apply(null, arguments)
};
var __GLOBAL__sub_I_InstrumentDataBelkhayateRenderer_cpp = Module["__GLOBAL__sub_I_InstrumentDataBelkhayateRenderer_cpp"] = function() {
    return Module["asm"]["zl"].apply(null, arguments)
};
var __GLOBAL__sub_I_InstrumentDataCCIRenderer_cpp = Module["__GLOBAL__sub_I_InstrumentDataCCIRenderer_cpp"] = function() {
    return Module["asm"]["Al"].apply(null, arguments)
};
var __GLOBAL__sub_I_InstrumentDataDPORenderer_cpp = Module["__GLOBAL__sub_I_InstrumentDataDPORenderer_cpp"] = function() {
    return Module["asm"]["Bl"].apply(null, arguments)
};
var __GLOBAL__sub_I_InstrumentDataKDJRenderer_cpp = Module["__GLOBAL__sub_I_InstrumentDataKDJRenderer_cpp"] = function() {
    return Module["asm"]["Cl"].apply(null, arguments)
};
var __GLOBAL__sub_I_InstrumentDataMACDRenderer_cpp = Module["__GLOBAL__sub_I_InstrumentDataMACDRenderer_cpp"] = function() {
    return Module["asm"]["Dl"].apply(null, arguments)
};
var __GLOBAL__sub_I_InstrumentDataMomentumRenderer_cpp = Module["__GLOBAL__sub_I_InstrumentDataMomentumRenderer_cpp"] = function() {
    return Module["asm"]["El"].apply(null, arguments)
};
var __GLOBAL__sub_I_InstrumentDataRSIRenderer_cpp = Module["__GLOBAL__sub_I_InstrumentDataRSIRenderer_cpp"] = function() {
    return Module["asm"]["Fl"].apply(null, arguments)
};
var __GLOBAL__sub_I_InstrumentDataScriptedRenderer_cpp = Module["__GLOBAL__sub_I_InstrumentDataScriptedRenderer_cpp"] = function() {
    return Module["asm"]["Gl"].apply(null, arguments)
};
var __GLOBAL__sub_I_InstrumentDataStochasticRenderer_cpp = Module["__GLOBAL__sub_I_InstrumentDataStochasticRenderer_cpp"] = function() {
    return Module["asm"]["Hl"].apply(null, arguments)
};
var __GLOBAL__sub_I_InstrumentDataWilliamsRangeRenderer_cpp = Module["__GLOBAL__sub_I_InstrumentDataWilliamsRangeRenderer_cpp"] = function() {
    return Module["asm"]["Il"].apply(null, arguments)
};
var __GLOBAL__sub_I_InstrumentPriceMovementRenderer_cpp = Module["__GLOBAL__sub_I_InstrumentPriceMovementRenderer_cpp"] = function() {
    return Module["asm"]["Jl"].apply(null, arguments)
};
var __GLOBAL__sub_I_InstrumentTypes_cpp = Module["__GLOBAL__sub_I_InstrumentTypes_cpp"] = function() {
    return Module["asm"]["Kl"].apply(null, arguments)
};
var __GLOBAL__sub_I_InstrumentsSubscriptionManager_cpp = Module["__GLOBAL__sub_I_InstrumentsSubscriptionManager_cpp"] = function() {
    return Module["asm"]["Ll"].apply(null, arguments)
};
var __GLOBAL__sub_I_KYCService_cpp = Module["__GLOBAL__sub_I_KYCService_cpp"] = function() {
    return Module["asm"]["Ml"].apply(null, arguments)
};
var __GLOBAL__sub_I_LeaderboardItem_cpp = Module["__GLOBAL__sub_I_LeaderboardItem_cpp"] = function() {
    return Module["asm"]["Nl"].apply(null, arguments)
};
var __GLOBAL__sub_I_LeftMenuSettings_cpp = Module["__GLOBAL__sub_I_LeftMenuSettings_cpp"] = function() {
    return Module["asm"]["Ol"].apply(null, arguments)
};
var __GLOBAL__sub_I_LeftPanelSmart_cpp = Module["__GLOBAL__sub_I_LeftPanelSmart_cpp"] = function() {
    return Module["asm"]["Pl"].apply(null, arguments)
};
var __GLOBAL__sub_I_ListBox_cpp = Module["__GLOBAL__sub_I_ListBox_cpp"] = function() {
    return Module["asm"]["Ql"].apply(null, arguments)
};
var __GLOBAL__sub_I_MFBuySellBlock_cpp = Module["__GLOBAL__sub_I_MFBuySellBlock_cpp"] = function() {
    return Module["asm"]["Rl"].apply(null, arguments)
};
var __GLOBAL__sub_I_MFExpBlock_cpp = Module["__GLOBAL__sub_I_MFExpBlock_cpp"] = function() {
    return Module["asm"]["Sl"].apply(null, arguments)
};
var __GLOBAL__sub_I_MFTpSlBlock_cpp = Module["__GLOBAL__sub_I_MFTpSlBlock_cpp"] = function() {
    return Module["asm"]["Tl"].apply(null, arguments)
};
var __GLOBAL__sub_I_MVBigDecimal_cpp = Module["__GLOBAL__sub_I_MVBigDecimal_cpp"] = function() {
    return Module["asm"]["Ul"].apply(null, arguments)
};
var __GLOBAL__sub_I_MVFont_cpp = Module["__GLOBAL__sub_I_MVFont_cpp"] = function() {
    return Module["asm"]["Vl"].apply(null, arguments)
};
var __GLOBAL__sub_I_MVLocalization_cpp = Module["__GLOBAL__sub_I_MVLocalization_cpp"] = function() {
    return Module["asm"]["Wl"].apply(null, arguments)
};
var __GLOBAL__sub_I_MVLog_cpp = Module["__GLOBAL__sub_I_MVLog_cpp"] = function() {
    return Module["asm"]["Xl"].apply(null, arguments)
};
var __GLOBAL__sub_I_MVRenderer_cpp = Module["__GLOBAL__sub_I_MVRenderer_cpp"] = function() {
    return Module["asm"]["Yl"].apply(null, arguments)
};
var __GLOBAL__sub_I_MVStringUtils_cpp = Module["__GLOBAL__sub_I_MVStringUtils_cpp"] = function() {
    return Module["asm"]["Zl"].apply(null, arguments)
};
var __GLOBAL__sub_I_MVTimeUtils_cpp = Module["__GLOBAL__sub_I_MVTimeUtils_cpp"] = function() {
    return Module["asm"]["_l"].apply(null, arguments)
};
var __GLOBAL__sub_I_ManagerChooseTimePopup_cpp = Module["__GLOBAL__sub_I_ManagerChooseTimePopup_cpp"] = function() {
    return Module["asm"]["$l"].apply(null, arguments)
};
var __GLOBAL__sub_I_ManagerExpandingSessionBlock_cpp = Module["__GLOBAL__sub_I_ManagerExpandingSessionBlock_cpp"] = function() {
    return Module["asm"]["am"].apply(null, arguments)
};
var __GLOBAL__sub_I_ManagerWorkTime_cpp = Module["__GLOBAL__sub_I_ManagerWorkTime_cpp"] = function() {
    return Module["asm"]["bm"].apply(null, arguments)
};
var __GLOBAL__sub_I_MarginBalancesListFactory_cpp = Module["__GLOBAL__sub_I_MarginBalancesListFactory_cpp"] = function() {
    return Module["asm"]["cm"].apply(null, arguments)
};
var __GLOBAL__sub_I_MarginalForexExpirationSelectorFactory_cpp = Module["__GLOBAL__sub_I_MarginalForexExpirationSelectorFactory_cpp"] = function() {
    return Module["asm"]["dm"].apply(null, arguments)
};
var __GLOBAL__sub_I_MarginalForexExpirationSelector_cpp = Module["__GLOBAL__sub_I_MarginalForexExpirationSelector_cpp"] = function() {
    return Module["asm"]["em"].apply(null, arguments)
};
var __GLOBAL__sub_I_MarginalForexPendingEditor_cpp = Module["__GLOBAL__sub_I_MarginalForexPendingEditor_cpp"] = function() {
    return Module["asm"]["fm"].apply(null, arguments)
};
var __GLOBAL__sub_I_MarginalForexPlotDirectionDeals_cpp = Module["__GLOBAL__sub_I_MarginalForexPlotDirectionDeals_cpp"] = function() {
    return Module["asm"]["gm"].apply(null, arguments)
};
var __GLOBAL__sub_I_MarginalForexPlotOrders_cpp = Module["__GLOBAL__sub_I_MarginalForexPlotOrders_cpp"] = function() {
    return Module["asm"]["hm"].apply(null, arguments)
};
var __GLOBAL__sub_I_MarginalForexTPSLSelector_cpp = Module["__GLOBAL__sub_I_MarginalForexTPSLSelector_cpp"] = function() {
    return Module["asm"]["im"].apply(null, arguments)
};
var __GLOBAL__sub_I_MarginalForexTrading_cpp = Module["__GLOBAL__sub_I_MarginalForexTrading_cpp"] = function() {
    return Module["asm"]["jm"].apply(null, arguments)
};
var __GLOBAL__sub_I_MarginalInstrumentController_cpp = Module["__GLOBAL__sub_I_MarginalInstrumentController_cpp"] = function() {
    return Module["asm"]["km"].apply(null, arguments)
};
var __GLOBAL__sub_I_MarginalPlotTPSL_cpp = Module["__GLOBAL__sub_I_MarginalPlotTPSL_cpp"] = function() {
    return Module["asm"]["lm"].apply(null, arguments)
};
var __GLOBAL__sub_I_MarginalUtils_cpp = Module["__GLOBAL__sub_I_MarginalUtils_cpp"] = function() {
    return Module["asm"]["mm"].apply(null, arguments)
};
var __GLOBAL__sub_I_MiniInstrumentDataQuotes_cpp = Module["__GLOBAL__sub_I_MiniInstrumentDataQuotes_cpp"] = function() {
    return Module["asm"]["nm"].apply(null, arguments)
};
var __GLOBAL__sub_I_MiniPlot_cpp = Module["__GLOBAL__sub_I_MiniPlot_cpp"] = function() {
    return Module["asm"]["om"].apply(null, arguments)
};
var __GLOBAL__sub_I_MobileViewDownloadApp_cpp = Module["__GLOBAL__sub_I_MobileViewDownloadApp_cpp"] = function() {
    return Module["asm"]["pm"].apply(null, arguments)
};
var __GLOBAL__sub_I_MobileViewHomescreen_cpp = Module["__GLOBAL__sub_I_MobileViewHomescreen_cpp"] = function() {
    return Module["asm"]["qm"].apply(null, arguments)
};
var __GLOBAL__sub_I_MobileViews_cpp = Module["__GLOBAL__sub_I_MobileViews_cpp"] = function() {
    return Module["asm"]["rm"].apply(null, arguments)
};
var __GLOBAL__sub_I_ModelBalances_cpp = Module["__GLOBAL__sub_I_ModelBalances_cpp"] = function() {
    return Module["asm"]["sm"].apply(null, arguments)
};
var __GLOBAL__sub_I_ModelDeals_cpp = Module["__GLOBAL__sub_I_ModelDeals_cpp"] = function() {
    return Module["asm"]["tm"].apply(null, arguments)
};
var __GLOBAL__sub_I_ModelItemsList_cpp = Module["__GLOBAL__sub_I_ModelItemsList_cpp"] = function() {
    return Module["asm"]["um"].apply(null, arguments)
};
var __GLOBAL__sub_I_ModelValue_cpp = Module["__GLOBAL__sub_I_ModelValue_cpp"] = function() {
    return Module["asm"]["vm"].apply(null, arguments)
};
var __GLOBAL__sub_I_MoneyFormatters_cpp = Module["__GLOBAL__sub_I_MoneyFormatters_cpp"] = function() {
    return Module["asm"]["wm"].apply(null, arguments)
};
var __GLOBAL__sub_I_MultiOptionRender_cpp = Module["__GLOBAL__sub_I_MultiOptionRender_cpp"] = function() {
    return Module["asm"]["xm"].apply(null, arguments)
};
var __GLOBAL__sub_I_MultiOptionRightPanel_cpp = Module["__GLOBAL__sub_I_MultiOptionRightPanel_cpp"] = function() {
    return Module["asm"]["ym"].apply(null, arguments)
};
var __GLOBAL__sub_I_MultiTradeService_cpp = Module["__GLOBAL__sub_I_MultiTradeService_cpp"] = function() {
    return Module["asm"]["zm"].apply(null, arguments)
};
var __GLOBAL__sub_I_MultiselectCombobox_cpp = Module["__GLOBAL__sub_I_MultiselectCombobox_cpp"] = function() {
    return Module["asm"]["Am"].apply(null, arguments)
};
var __GLOBAL__sub_I_NativeIndicatorAdapterBase_cpp = Module["__GLOBAL__sub_I_NativeIndicatorAdapterBase_cpp"] = function() {
    return Module["asm"]["Bm"].apply(null, arguments)
};
var __GLOBAL__sub_I_NativeSystemDialogs_cpp = Module["__GLOBAL__sub_I_NativeSystemDialogs_cpp"] = function() {
    return Module["asm"]["Cm"].apply(null, arguments)
};
var __GLOBAL__sub_I_NearestExpirationsList_cpp = Module["__GLOBAL__sub_I_NearestExpirationsList_cpp"] = function() {
    return Module["asm"]["Dm"].apply(null, arguments)
};
var __GLOBAL__sub_I_NewsBubble_cpp = Module["__GLOBAL__sub_I_NewsBubble_cpp"] = function() {
    return Module["asm"]["Em"].apply(null, arguments)
};
var __GLOBAL__sub_I_NewsOnPlotHelper_cpp = Module["__GLOBAL__sub_I_NewsOnPlotHelper_cpp"] = function() {
    return Module["asm"]["Fm"].apply(null, arguments)
};
var __GLOBAL__sub_I_NewsOnPlot_cpp = Module["__GLOBAL__sub_I_NewsOnPlot_cpp"] = function() {
    return Module["asm"]["Gm"].apply(null, arguments)
};
var __GLOBAL__sub_I_NewsService_cpp = Module["__GLOBAL__sub_I_NewsService_cpp"] = function() {
    return Module["asm"]["Hm"].apply(null, arguments)
};
var __GLOBAL__sub_I_NewsSettingsPopup_cpp = Module["__GLOBAL__sub_I_NewsSettingsPopup_cpp"] = function() {
    return Module["asm"]["Im"].apply(null, arguments)
};
var __GLOBAL__sub_I_NotificationsEvents_cpp = Module["__GLOBAL__sub_I_NotificationsEvents_cpp"] = function() {
    return Module["asm"]["Jm"].apply(null, arguments)
};
var __GLOBAL__sub_I_OrderBookService_cpp = Module["__GLOBAL__sub_I_OrderBookService_cpp"] = function() {
    return Module["asm"]["Km"].apply(null, arguments)
};
var __GLOBAL__sub_I_OrdersBottomPortfolioViewModel_cpp = Module["__GLOBAL__sub_I_OrdersBottomPortfolioViewModel_cpp"] = function() {
    return Module["asm"]["Lm"].apply(null, arguments)
};
var __GLOBAL__sub_I_OrdersPortfolioLeftPanelViewModel_cpp = Module["__GLOBAL__sub_I_OrdersPortfolioLeftPanelViewModel_cpp"] = function() {
    return Module["asm"]["Mm"].apply(null, arguments)
};
var __GLOBAL__sub_I_Pen_cpp = Module["__GLOBAL__sub_I_Pen_cpp"] = function() {
    return Module["asm"]["Nm"].apply(null, arguments)
};
var __GLOBAL__sub_I_PipsService_cpp = Module["__GLOBAL__sub_I_PipsService_cpp"] = function() {
    return Module["asm"]["Om"].apply(null, arguments)
};
var __GLOBAL__sub_I_PlotAlertPanel_cpp = Module["__GLOBAL__sub_I_PlotAlertPanel_cpp"] = function() {
    return Module["asm"]["Pm"].apply(null, arguments)
};
var __GLOBAL__sub_I_PlotShadow_cpp = Module["__GLOBAL__sub_I_PlotShadow_cpp"] = function() {
    return Module["asm"]["Qm"].apply(null, arguments)
};
var __GLOBAL__sub_I_PluralForms_cpp = Module["__GLOBAL__sub_I_PluralForms_cpp"] = function() {
    return Module["asm"]["Rm"].apply(null, arguments)
};
var __GLOBAL__sub_I_PnlService_cpp = Module["__GLOBAL__sub_I_PnlService_cpp"] = function() {
    return Module["asm"]["Sm"].apply(null, arguments)
};
var __GLOBAL__sub_I_PopupManager_cpp = Module["__GLOBAL__sub_I_PopupManager_cpp"] = function() {
    return Module["asm"]["Tm"].apply(null, arguments)
};
var __GLOBAL__sub_I_PopupNotificationService_cpp = Module["__GLOBAL__sub_I_PopupNotificationService_cpp"] = function() {
    return Module["asm"]["Um"].apply(null, arguments)
};
var __GLOBAL__sub_I_PortfolioItemBind_cpp = Module["__GLOBAL__sub_I_PortfolioItemBind_cpp"] = function() {
    return Module["asm"]["Vm"].apply(null, arguments)
};
var __GLOBAL__sub_I_PortfolioViewModeContextMenu_cpp = Module["__GLOBAL__sub_I_PortfolioViewModeContextMenu_cpp"] = function() {
    return Module["asm"]["Wm"].apply(null, arguments)
};
var __GLOBAL__sub_I_PositionInstrumentBinary_cpp = Module["__GLOBAL__sub_I_PositionInstrumentBinary_cpp"] = function() {
    return Module["asm"]["Xm"].apply(null, arguments)
};
var __GLOBAL__sub_I_PositionInstrumentCFD_cpp = Module["__GLOBAL__sub_I_PositionInstrumentCFD_cpp"] = function() {
    return Module["asm"]["Ym"].apply(null, arguments)
};
var __GLOBAL__sub_I_PositionInstrumentDigital_cpp = Module["__GLOBAL__sub_I_PositionInstrumentDigital_cpp"] = function() {
    return Module["asm"]["Zm"].apply(null, arguments)
};
var __GLOBAL__sub_I_PositionInstrumentFX_cpp = Module["__GLOBAL__sub_I_PositionInstrumentFX_cpp"] = function() {
    return Module["asm"]["_m"].apply(null, arguments)
};
var __GLOBAL__sub_I_PositionInstrumentMulti_cpp = Module["__GLOBAL__sub_I_PositionInstrumentMulti_cpp"] = function() {
    return Module["asm"]["$m"].apply(null, arguments)
};
var __GLOBAL__sub_I_PotentialOrder_cpp = Module["__GLOBAL__sub_I_PotentialOrder_cpp"] = function() {
    return Module["asm"]["an"].apply(null, arguments)
};
var __GLOBAL__sub_I_PriceInfoBlock_cpp = Module["__GLOBAL__sub_I_PriceInfoBlock_cpp"] = function() {
    return Module["asm"]["bn"].apply(null, arguments)
};
var __GLOBAL__sub_I_PriceMovementsService_cpp = Module["__GLOBAL__sub_I_PriceMovementsService_cpp"] = function() {
    return Module["asm"]["cn"].apply(null, arguments)
};
var __GLOBAL__sub_I_ProTraderService_cpp = Module["__GLOBAL__sub_I_ProTraderService_cpp"] = function() {
    return Module["asm"]["dn"].apply(null, arguments)
};
var __GLOBAL__sub_I_ProxyDealsFilter_cpp = Module["__GLOBAL__sub_I_ProxyDealsFilter_cpp"] = function() {
    return Module["asm"]["en"].apply(null, arguments)
};
var __GLOBAL__sub_I_PurchaseConfirmationPopup_cpp = Module["__GLOBAL__sub_I_PurchaseConfirmationPopup_cpp"] = function() {
    return Module["asm"]["fn"].apply(null, arguments)
};
var __GLOBAL__sub_I_QrCode_cpp = Module["__GLOBAL__sub_I_QrCode_cpp"] = function() {
    return Module["asm"]["gn"].apply(null, arguments)
};
var __GLOBAL__sub_I_QuantitySelectorPopup_cpp = Module["__GLOBAL__sub_I_QuantitySelectorPopup_cpp"] = function() {
    return Module["asm"]["hn"].apply(null, arguments)
};
var __GLOBAL__sub_I_RPAmountBlock_cpp = Module["__GLOBAL__sub_I_RPAmountBlock_cpp"] = function() {
    return Module["asm"]["jn"].apply(null, arguments)
};
var __GLOBAL__sub_I_RPCallPutBlock_cpp = Module["__GLOBAL__sub_I_RPCallPutBlock_cpp"] = function() {
    return Module["asm"]["kn"].apply(null, arguments)
};
var __GLOBAL__sub_I_RPMultiModeSwitcherBlock_cpp = Module["__GLOBAL__sub_I_RPMultiModeSwitcherBlock_cpp"] = function() {
    return Module["asm"]["ln"].apply(null, arguments)
};
var __GLOBAL__sub_I_RPProfitBlock_cpp = Module["__GLOBAL__sub_I_RPProfitBlock_cpp"] = function() {
    return Module["asm"]["mn"].apply(null, arguments)
};
var __GLOBAL__sub_I_RPTimeInputBlock_cpp = Module["__GLOBAL__sub_I_RPTimeInputBlock_cpp"] = function() {
    return Module["asm"]["nn"].apply(null, arguments)
};
var __GLOBAL__sub_I_RandomQuotesProvider_cpp = Module["__GLOBAL__sub_I_RandomQuotesProvider_cpp"] = function() {
    return Module["asm"]["on"].apply(null, arguments)
};
var __GLOBAL__sub_I_SDFData_cpp = Module["__GLOBAL__sub_I_SDFData_cpp"] = function() {
    return Module["asm"]["pn"].apply(null, arguments)
};
var __GLOBAL__sub_I_ScriptedIndicatorsService_cpp = Module["__GLOBAL__sub_I_ScriptedIndicatorsService_cpp"] = function() {
    return Module["asm"]["qn"].apply(null, arguments)
};
var __GLOBAL__sub_I_ScriptedInstrument_cpp = Module["__GLOBAL__sub_I_ScriptedInstrument_cpp"] = function() {
    return Module["asm"]["rn"].apply(null, arguments)
};
var __GLOBAL__sub_I_ScrollingText_cpp = Module["__GLOBAL__sub_I_ScrollingText_cpp"] = function() {
    return Module["asm"]["sn"].apply(null, arguments)
};
var __GLOBAL__sub_I_ServiceHelper_cpp = Module["__GLOBAL__sub_I_ServiceHelper_cpp"] = function() {
    return Module["asm"]["tn"].apply(null, arguments)
};
var __GLOBAL__sub_I_SimplifierFeatures_cpp = Module["__GLOBAL__sub_I_SimplifierFeatures_cpp"] = function() {
    return Module["asm"]["un"].apply(null, arguments)
};
var __GLOBAL__sub_I_SpinBoxBase_cpp = Module["__GLOBAL__sub_I_SpinBoxBase_cpp"] = function() {
    return Module["asm"]["vn"].apply(null, arguments)
};
var __GLOBAL__sub_I_SpinBoxDouble_cpp = Module["__GLOBAL__sub_I_SpinBoxDouble_cpp"] = function() {
    return Module["asm"]["wn"].apply(null, arguments)
};
var __GLOBAL__sub_I_SpinBoxInt_cpp = Module["__GLOBAL__sub_I_SpinBoxInt_cpp"] = function() {
    return Module["asm"]["xn"].apply(null, arguments)
};
var __GLOBAL__sub_I_StackPanel_cpp = Module["__GLOBAL__sub_I_StackPanel_cpp"] = function() {
    return Module["asm"]["yn"].apply(null, arguments)
};
var __GLOBAL__sub_I_TPSLInstrument_cpp = Module["__GLOBAL__sub_I_TPSLInstrument_cpp"] = function() {
    return Module["asm"]["zn"].apply(null, arguments)
};
var __GLOBAL__sub_I_TechInstrumentsService_cpp = Module["__GLOBAL__sub_I_TechInstrumentsService_cpp"] = function() {
    return Module["asm"]["An"].apply(null, arguments)
};
var __GLOBAL__sub_I_TemplatePanel_cpp = Module["__GLOBAL__sub_I_TemplatePanel_cpp"] = function() {
    return Module["asm"]["Bn"].apply(null, arguments)
};
var __GLOBAL__sub_I_TickingPortfolioManager_cpp = Module["__GLOBAL__sub_I_TickingPortfolioManager_cpp"] = function() {
    return Module["asm"]["Cn"].apply(null, arguments)
};
var __GLOBAL__sub_I_TimeOffsetModel_cpp = Module["__GLOBAL__sub_I_TimeOffsetModel_cpp"] = function() {
    return Module["asm"]["Dn"].apply(null, arguments)
};
var __GLOBAL__sub_I_TimePointModel_cpp = Module["__GLOBAL__sub_I_TimePointModel_cpp"] = function() {
    return Module["asm"]["En"].apply(null, arguments)
};
var __GLOBAL__sub_I_TimeSelector_cpp = Module["__GLOBAL__sub_I_TimeSelector_cpp"] = function() {
    return Module["asm"]["Fn"].apply(null, arguments)
};
var __GLOBAL__sub_I_Timer_cpp = Module["__GLOBAL__sub_I_Timer_cpp"] = function() {
    return Module["asm"]["Gn"].apply(null, arguments)
};
var __GLOBAL__sub_I_TooltipEvents_cpp = Module["__GLOBAL__sub_I_TooltipEvents_cpp"] = function() {
    return Module["asm"]["Hn"].apply(null, arguments)
};
var __GLOBAL__sub_I_TopDealsCombobox_cpp = Module["__GLOBAL__sub_I_TopDealsCombobox_cpp"] = function() {
    return Module["asm"]["In"].apply(null, arguments)
};
var __GLOBAL__sub_I_TopDealsElementFactory_cpp = Module["__GLOBAL__sub_I_TopDealsElementFactory_cpp"] = function() {
    return Module["asm"]["Jn"].apply(null, arguments)
};
var __GLOBAL__sub_I_TopDealsModel_cpp = Module["__GLOBAL__sub_I_TopDealsModel_cpp"] = function() {
    return Module["asm"]["Kn"].apply(null, arguments)
};
var __GLOBAL__sub_I_TopDealsTab_cpp = Module["__GLOBAL__sub_I_TopDealsTab_cpp"] = function() {
    return Module["asm"]["Ln"].apply(null, arguments)
};
var __GLOBAL__sub_I_TournamentsService_cpp = Module["__GLOBAL__sub_I_TournamentsService_cpp"] = function() {
    return Module["asm"]["Mn"].apply(null, arguments)
};
var __GLOBAL__sub_I_TradersMoodInfoBlock_cpp = Module["__GLOBAL__sub_I_TradersMoodInfoBlock_cpp"] = function() {
    return Module["asm"]["Nn"].apply(null, arguments)
};
var __GLOBAL__sub_I_TradersMoodLine_cpp = Module["__GLOBAL__sub_I_TradersMoodLine_cpp"] = function() {
    return Module["asm"]["On"].apply(null, arguments)
};
var __GLOBAL__sub_I_TradersMoodRomb_cpp = Module["__GLOBAL__sub_I_TradersMoodRomb_cpp"] = function() {
    return Module["asm"]["Pn"].apply(null, arguments)
};
var __GLOBAL__sub_I_TradersMoodService_cpp = Module["__GLOBAL__sub_I_TradersMoodService_cpp"] = function() {
    return Module["asm"]["Qn"].apply(null, arguments)
};
var __GLOBAL__sub_I_TrafficSniffer_cpp = Module["__GLOBAL__sub_I_TrafficSniffer_cpp"] = function() {
    return Module["asm"]["Rn"].apply(null, arguments)
};
var __GLOBAL__sub_I_TranslationsService_cpp = Module["__GLOBAL__sub_I_TranslationsService_cpp"] = function() {
    return Module["asm"]["Sn"].apply(null, arguments)
};
var __GLOBAL__sub_I_TreeQuery_cpp = Module["__GLOBAL__sub_I_TreeQuery_cpp"] = function() {
    return Module["asm"]["Tn"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIAnimatedSprite_cpp = Module["__GLOBAL__sub_I_UIAnimatedSprite_cpp"] = function() {
    return Module["asm"]["Un"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIBoxBlockElement_cpp = Module["__GLOBAL__sub_I_UIBoxBlockElement_cpp"] = function() {
    return Module["asm"]["Vn"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIBox_cpp = Module["__GLOBAL__sub_I_UIBox_cpp"] = function() {
    return Module["asm"]["Wn"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIBtnProgressBar_cpp = Module["__GLOBAL__sub_I_UIBtnProgressBar_cpp"] = function() {
    return Module["asm"]["Xn"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIBtnWithConfirm_cpp = Module["__GLOBAL__sub_I_UIBtnWithConfirm_cpp"] = function() {
    return Module["asm"]["Yn"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIButton_cpp = Module["__GLOBAL__sub_I_UIButton_cpp"] = function() {
    return Module["asm"]["Zn"].apply(null, arguments)
};
var __GLOBAL__sub_I_UICheckBox_cpp = Module["__GLOBAL__sub_I_UICheckBox_cpp"] = function() {
    return Module["asm"]["_n"].apply(null, arguments)
};
var __GLOBAL__sub_I_UICircleMultiProgressBar_cpp = Module["__GLOBAL__sub_I_UICircleMultiProgressBar_cpp"] = function() {
    return Module["asm"]["$n"].apply(null, arguments)
};
var __GLOBAL__sub_I_UICircleProgressBar_cpp = Module["__GLOBAL__sub_I_UICircleProgressBar_cpp"] = function() {
    return Module["asm"]["ao"].apply(null, arguments)
};
var __GLOBAL__sub_I_UICollapsibleLabel_cpp = Module["__GLOBAL__sub_I_UICollapsibleLabel_cpp"] = function() {
    return Module["asm"]["bo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIControl_cpp = Module["__GLOBAL__sub_I_UIControl_cpp"] = function() {
    return Module["asm"]["co"].apply(null, arguments)
};
var __GLOBAL__sub_I_UICurrencyAmount_cpp = Module["__GLOBAL__sub_I_UICurrencyAmount_cpp"] = function() {
    return Module["asm"]["eo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIDraggable_cpp = Module["__GLOBAL__sub_I_UIDraggable_cpp"] = function() {
    return Module["asm"]["fo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIElement_cpp = Module["__GLOBAL__sub_I_UIElement_cpp"] = function() {
    return Module["asm"]["go"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIElidedLabel_cpp = Module["__GLOBAL__sub_I_UIElidedLabel_cpp"] = function() {
    return Module["asm"]["ho"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIFrame_cpp = Module["__GLOBAL__sub_I_UIFrame_cpp"] = function() {
    return Module["asm"]["io"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIGridColorPicker_cpp = Module["__GLOBAL__sub_I_UIGridColorPicker_cpp"] = function() {
    return Module["asm"]["jo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIGrid_cpp = Module["__GLOBAL__sub_I_UIGrid_cpp"] = function() {
    return Module["asm"]["ko"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIHint_cpp = Module["__GLOBAL__sub_I_UIHint_cpp"] = function() {
    return Module["asm"]["lo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIHsvPicker_cpp = Module["__GLOBAL__sub_I_UIHsvPicker_cpp"] = function() {
    return Module["asm"]["mo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIHtmlView_cpp = Module["__GLOBAL__sub_I_UIHtmlView_cpp"] = function() {
    return Module["asm"]["no"].apply(null, arguments)
};
var __GLOBAL__sub_I_UILine_cpp = Module["__GLOBAL__sub_I_UILine_cpp"] = function() {
    return Module["asm"]["oo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIMeter_cpp = Module["__GLOBAL__sub_I_UIMeter_cpp"] = function() {
    return Module["asm"]["po"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIOrderBookCryptoAnimations_cpp = Module["__GLOBAL__sub_I_UIOrderBookCryptoAnimations_cpp"] = function() {
    return Module["asm"]["qo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIOrderBookCryptoColumns_cpp = Module["__GLOBAL__sub_I_UIOrderBookCryptoColumns_cpp"] = function() {
    return Module["asm"]["ro"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIOrderBookCrypto_cpp = Module["__GLOBAL__sub_I_UIOrderBookCrypto_cpp"] = function() {
    return Module["asm"]["so"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIOrderBookHistory_cpp = Module["__GLOBAL__sub_I_UIOrderBookHistory_cpp"] = function() {
    return Module["asm"]["to"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIOrderBook_cpp = Module["__GLOBAL__sub_I_UIOrderBook_cpp"] = function() {
    return Module["asm"]["uo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIPlaceholderImage_cpp = Module["__GLOBAL__sub_I_UIPlaceholderImage_cpp"] = function() {
    return Module["asm"]["vo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIPreloader_cpp = Module["__GLOBAL__sub_I_UIPreloader_cpp"] = function() {
    return Module["asm"]["wo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIProgressBar_cpp = Module["__GLOBAL__sub_I_UIProgressBar_cpp"] = function() {
    return Module["asm"]["xo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIQRCodeElement_cpp = Module["__GLOBAL__sub_I_UIQRCodeElement_cpp"] = function() {
    return Module["asm"]["yo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIRadioBox_cpp = Module["__GLOBAL__sub_I_UIRadioBox_cpp"] = function() {
    return Module["asm"]["zo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIRadioButton_cpp = Module["__GLOBAL__sub_I_UIRadioButton_cpp"] = function() {
    return Module["asm"]["Ao"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIScale_cpp = Module["__GLOBAL__sub_I_UIScale_cpp"] = function() {
    return Module["asm"]["Bo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIScrollBarNew_cpp = Module["__GLOBAL__sub_I_UIScrollBarNew_cpp"] = function() {
    return Module["asm"]["Co"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIScrollBar_cpp = Module["__GLOBAL__sub_I_UIScrollBar_cpp"] = function() {
    return Module["asm"]["Do"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIScrollView_cpp = Module["__GLOBAL__sub_I_UIScrollView_cpp"] = function() {
    return Module["asm"]["Eo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UISectionList_cpp = Module["__GLOBAL__sub_I_UISectionList_cpp"] = function() {
    return Module["asm"]["Fo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UISelectorPicker_cpp = Module["__GLOBAL__sub_I_UISelectorPicker_cpp"] = function() {
    return Module["asm"]["Go"].apply(null, arguments)
};
var __GLOBAL__sub_I_UISlider_cpp = Module["__GLOBAL__sub_I_UISlider_cpp"] = function() {
    return Module["asm"]["Ho"].apply(null, arguments)
};
var __GLOBAL__sub_I_UISmallConfirmationButton_cpp = Module["__GLOBAL__sub_I_UISmallConfirmationButton_cpp"] = function() {
    return Module["asm"]["Io"].apply(null, arguments)
};
var __GLOBAL__sub_I_UITabControl_cpp = Module["__GLOBAL__sub_I_UITabControl_cpp"] = function() {
    return Module["asm"]["Jo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UITabPanel_cpp = Module["__GLOBAL__sub_I_UITabPanel_cpp"] = function() {
    return Module["asm"]["Ko"].apply(null, arguments)
};
var __GLOBAL__sub_I_UITextBox_cpp = Module["__GLOBAL__sub_I_UITextBox_cpp"] = function() {
    return Module["asm"]["Lo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UITimer_cpp = Module["__GLOBAL__sub_I_UITimer_cpp"] = function() {
    return Module["asm"]["Mo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIToggleBtns_cpp = Module["__GLOBAL__sub_I_UIToggleBtns_cpp"] = function() {
    return Module["asm"]["No"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIToggleableButton_cpp = Module["__GLOBAL__sub_I_UIToggleableButton_cpp"] = function() {
    return Module["asm"]["Oo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIVideoPlayer_cpp = Module["__GLOBAL__sub_I_UIVideoPlayer_cpp"] = function() {
    return Module["asm"]["Po"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIVirtualKeyboard_cpp = Module["__GLOBAL__sub_I_UIVirtualKeyboard_cpp"] = function() {
    return Module["asm"]["Qo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIWebCamera_cpp = Module["__GLOBAL__sub_I_UIWebCamera_cpp"] = function() {
    return Module["asm"]["Ro"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIWebImage_cpp = Module["__GLOBAL__sub_I_UIWebImage_cpp"] = function() {
    return Module["asm"]["So"].apply(null, arguments)
};
var __GLOBAL__sub_I_UIWebView_cpp = Module["__GLOBAL__sub_I_UIWebView_cpp"] = function() {
    return Module["asm"]["To"].apply(null, arguments)
};
var __GLOBAL__sub_I_UI_cpp = Module["__GLOBAL__sub_I_UI_cpp"] = function() {
    return Module["asm"]["Uo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UString_cpp = Module["__GLOBAL__sub_I_UString_cpp"] = function() {
    return Module["asm"]["Vo"].apply(null, arguments)
};
var __GLOBAL__sub_I_UserSettingsService_cpp = Module["__GLOBAL__sub_I_UserSettingsService_cpp"] = function() {
    return Module["asm"]["Wo"].apply(null, arguments)
};
var __GLOBAL__sub_I_VideoCaptureWeb_cpp = Module["__GLOBAL__sub_I_VideoCaptureWeb_cpp"] = function() {
    return Module["asm"]["Xo"].apply(null, arguments)
};
var __GLOBAL__sub_I_VideoEducationService_cpp = Module["__GLOBAL__sub_I_VideoEducationService_cpp"] = function() {
    return Module["asm"]["Yo"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewBase_cpp = Module["__GLOBAL__sub_I_ViewBase_cpp"] = function() {
    return Module["asm"]["Zo"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewComboBox_cpp = Module["__GLOBAL__sub_I_ViewComboBox_cpp"] = function() {
    return Module["asm"]["_o"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewDeletedAccount_cpp = Module["__GLOBAL__sub_I_ViewDeletedAccount_cpp"] = function() {
    return Module["asm"]["$o"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewDialogEditAlert_cpp = Module["__GLOBAL__sub_I_ViewDialogEditAlert_cpp"] = function() {
    return Module["asm"]["ap"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewDialogIndicatorScripted_cpp = Module["__GLOBAL__sub_I_ViewDialogIndicatorScripted_cpp"] = function() {
    return Module["asm"]["bp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewDialogManagerProfile_cpp = Module["__GLOBAL__sub_I_ViewDialogManagerProfile_cpp"] = function() {
    return Module["asm"]["cp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewDialogMarginalBalance_cpp = Module["__GLOBAL__sub_I_ViewDialogMarginalBalance_cpp"] = function() {
    return Module["asm"]["dp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewDialogOvernightHistory_cpp = Module["__GLOBAL__sub_I_ViewDialogOvernightHistory_cpp"] = function() {
    return Module["asm"]["ep"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewDialogRateManager_cpp = Module["__GLOBAL__sub_I_ViewDialogRateManager_cpp"] = function() {
    return Module["asm"]["fp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewDialogSelectAccount_cpp = Module["__GLOBAL__sub_I_ViewDialogSelectAccount_cpp"] = function() {
    return Module["asm"]["gp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewDialogSettingsAbout_cpp = Module["__GLOBAL__sub_I_ViewDialogSettingsAbout_cpp"] = function() {
    return Module["asm"]["hp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewDialogSettingsBasic_cpp = Module["__GLOBAL__sub_I_ViewDialogSettingsBasic_cpp"] = function() {
    return Module["asm"]["ip"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewDialogSettingsHotKeys_cpp = Module["__GLOBAL__sub_I_ViewDialogSettingsHotKeys_cpp"] = function() {
    return Module["asm"]["jp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewDialogSettingsNotifications_cpp = Module["__GLOBAL__sub_I_ViewDialogSettingsNotifications_cpp"] = function() {
    return Module["asm"]["kp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewDialogSettingsPage_cpp = Module["__GLOBAL__sub_I_ViewDialogSettingsPage_cpp"] = function() {
    return Module["asm"]["lp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewDialogSettingsPrivacy_cpp = Module["__GLOBAL__sub_I_ViewDialogSettingsPrivacy_cpp"] = function() {
    return Module["asm"]["mp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewDialogSettingsTrading_cpp = Module["__GLOBAL__sub_I_ViewDialogSettingsTrading_cpp"] = function() {
    return Module["asm"]["np"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewDialogSettings_cpp = Module["__GLOBAL__sub_I_ViewDialogSettings_cpp"] = function() {
    return Module["asm"]["op"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewDialogTournamentReg_cpp = Module["__GLOBAL__sub_I_ViewDialogTournamentReg_cpp"] = function() {
    return Module["asm"]["pp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewFactoryDefault_cpp = Module["__GLOBAL__sub_I_ViewFactoryDefault_cpp"] = function() {
    return Module["asm"]["qp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewFactoryFullscreenPanel_cpp = Module["__GLOBAL__sub_I_ViewFactoryFullscreenPanel_cpp"] = function() {
    return Module["asm"]["rp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewFactoryOrdersLeftPanel_cpp = Module["__GLOBAL__sub_I_ViewFactoryOrdersLeftPanel_cpp"] = function() {
    return Module["asm"]["sp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewFactoryPortfolioLeftPanel_cpp = Module["__GLOBAL__sub_I_ViewFactoryPortfolioLeftPanel_cpp"] = function() {
    return Module["asm"]["tp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewFactoryTemplate_cpp = Module["__GLOBAL__sub_I_ViewFactoryTemplate_cpp"] = function() {
    return Module["asm"]["up"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewFrame_cpp = Module["__GLOBAL__sub_I_ViewFrame_cpp"] = function() {
    return Module["asm"]["vp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewItemsList_cpp = Module["__GLOBAL__sub_I_ViewItemsList_cpp"] = function() {
    return Module["asm"]["wp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewItemsTree_cpp = Module["__GLOBAL__sub_I_ViewItemsTree_cpp"] = function() {
    return Module["asm"]["xp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewLogin_cpp = Module["__GLOBAL__sub_I_ViewLogin_cpp"] = function() {
    return Module["asm"]["yp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewMain_cpp = Module["__GLOBAL__sub_I_ViewMain_cpp"] = function() {
    return Module["asm"]["zp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewMarginalForexDealItem_cpp = Module["__GLOBAL__sub_I_ViewMarginalForexDealItem_cpp"] = function() {
    return Module["asm"]["Ap"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewMarginalForexExpiration_cpp = Module["__GLOBAL__sub_I_ViewMarginalForexExpiration_cpp"] = function() {
    return Module["asm"]["Bp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewMarginalForexOrderItem_cpp = Module["__GLOBAL__sub_I_ViewMarginalForexOrderItem_cpp"] = function() {
    return Module["asm"]["Cp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewMarginalForexPlotDeals_cpp = Module["__GLOBAL__sub_I_ViewMarginalForexPlotDeals_cpp"] = function() {
    return Module["asm"]["Dp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewMarginalForexRightPanel_cpp = Module["__GLOBAL__sub_I_ViewMarginalForexRightPanel_cpp"] = function() {
    return Module["asm"]["Ep"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewPortfolioBottomPanel_cpp = Module["__GLOBAL__sub_I_ViewPortfolioBottomPanel_cpp"] = function() {
    return Module["asm"]["Fp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewPortfolioDealInfo_cpp = Module["__GLOBAL__sub_I_ViewPortfolioDealInfo_cpp"] = function() {
    return Module["asm"]["Gp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewPortfolioFullscreenPanel_cpp = Module["__GLOBAL__sub_I_ViewPortfolioFullscreenPanel_cpp"] = function() {
    return Module["asm"]["Hp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewPortfolioLeftPanel_cpp = Module["__GLOBAL__sub_I_ViewPortfolioLeftPanel_cpp"] = function() {
    return Module["asm"]["Ip"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewSocialProfilePopup_cpp = Module["__GLOBAL__sub_I_ViewSocialProfilePopup_cpp"] = function() {
    return Module["asm"]["Jp"].apply(null, arguments)
};
var __GLOBAL__sub_I_ViewTimeToOpenAsset_cpp = Module["__GLOBAL__sub_I_ViewTimeToOpenAsset_cpp"] = function() {
    return Module["asm"]["Kp"].apply(null, arguments)
};
var __GLOBAL__sub_I_VirtualKeyboardDefaultPad_cpp = Module["__GLOBAL__sub_I_VirtualKeyboardDefaultPad_cpp"] = function() {
    return Module["asm"]["Lp"].apply(null, arguments)
};
var __GLOBAL__sub_I_VirtualKeyboardDefines_cpp = Module["__GLOBAL__sub_I_VirtualKeyboardDefines_cpp"] = function() {
    return Module["asm"]["Mp"].apply(null, arguments)
};
var __GLOBAL__sub_I_VirtualKeyboardDigitsPad_cpp = Module["__GLOBAL__sub_I_VirtualKeyboardDigitsPad_cpp"] = function() {
    return Module["asm"]["Np"].apply(null, arguments)
};
var __GLOBAL__sub_I_VirtualKeyboard_cpp = Module["__GLOBAL__sub_I_VirtualKeyboard_cpp"] = function() {
    return Module["asm"]["Op"].apply(null, arguments)
};
var __GLOBAL__sub_I_WebMediaPlayer_cpp = Module["__GLOBAL__sub_I_WebMediaPlayer_cpp"] = function() {
    return Module["asm"]["Pp"].apply(null, arguments)
};
var __GLOBAL__sub_I_WebScreenshot_cpp = Module["__GLOBAL__sub_I_WebScreenshot_cpp"] = function() {
    return Module["asm"]["Qp"].apply(null, arguments)
};
var __GLOBAL__sub_I_WebSocket_cpp = Module["__GLOBAL__sub_I_WebSocket_cpp"] = function() {
    return Module["asm"]["Rp"].apply(null, arguments)
};
var __GLOBAL__sub_I_XHRResponse_cpp = Module["__GLOBAL__sub_I_XHRResponse_cpp"] = function() {
    return Module["asm"]["Sp"].apply(null, arguments)
};
var __GLOBAL__sub_I_bind_cpp = Module["__GLOBAL__sub_I_bind_cpp"] = function() {
    return Module["asm"]["Tp"].apply(null, arguments)
};
var __GLOBAL__sub_I_brand_defs_cpp = Module["__GLOBAL__sub_I_brand_defs_cpp"] = function() {
    return Module["asm"]["Up"].apply(null, arguments)
};
var __GLOBAL__sub_I_crc32_cpp = Module["__GLOBAL__sub_I_crc32_cpp"] = function() {
    return Module["asm"]["Vp"].apply(null, arguments)
};
var __GLOBAL__sub_I_iostream_cpp = Module["__GLOBAL__sub_I_iostream_cpp"] = function() {
    return Module["asm"]["Wp"].apply(null, arguments)
};
var __GLOBAL__sub_I_main_cpp = Module["__GLOBAL__sub_I_main_cpp"] = function() {
    return Module["asm"]["Xp"].apply(null, arguments)
};
var __ZSt18uncaught_exceptionv = Module["__ZSt18uncaught_exceptionv"] = function() {
    return Module["asm"]["Yp"].apply(null, arguments)
};
var ___cxx_global_var_init_16_3605 = Module["___cxx_global_var_init_16_3605"] = function() {
    return Module["asm"]["Zp"].apply(null, arguments)
};
var ___cxx_global_var_init_3_3583 = Module["___cxx_global_var_init_3_3583"] = function() {
    return Module["asm"]["_p"].apply(null, arguments)
};
var ___cxx_global_var_init_4_3584 = Module["___cxx_global_var_init_4_3584"] = function() {
    return Module["asm"]["$p"].apply(null, arguments)
};
var ___cxx_global_var_init_5_3585 = Module["___cxx_global_var_init_5_3585"] = function() {
    return Module["asm"]["aq"].apply(null, arguments)
};
var ___cxx_global_var_init_6_3040 = Module["___cxx_global_var_init_6_3040"] = function() {
    return Module["asm"]["bq"].apply(null, arguments)
};
var ___embind_register_native_and_builtin_types = Module["___embind_register_native_and_builtin_types"] = function() {
    return Module["asm"]["cq"].apply(null, arguments)
};
var ___emscripten_environ_constructor = Module["___emscripten_environ_constructor"] = function() {
    return Module["asm"]["dq"].apply(null, arguments)
};
var ___errno_location = Module["___errno_location"] = function() {
    return Module["asm"]["eq"].apply(null, arguments)
};
var ___getTypeName = Module["___getTypeName"] = function() {
    return Module["asm"]["fq"].apply(null, arguments)
};
var __get_daylight = Module["__get_daylight"] = function() {
    return Module["asm"]["gq"].apply(null, arguments)
};
var __get_timezone = Module["__get_timezone"] = function() {
    return Module["asm"]["hq"].apply(null, arguments)
};
var __get_tzname = Module["__get_tzname"] = function() {
    return Module["asm"]["iq"].apply(null, arguments)
};
var _free = Module["_free"] = function() {
    return Module["asm"]["jq"].apply(null, arguments)
};
var _main = Module["_main"] = function() {
    return Module["asm"]["kq"].apply(null, arguments)
};
var _malloc = Module["_malloc"] = function() {
    return Module["asm"]["lq"].apply(null, arguments)
};
var _memalign = Module["_memalign"] = function() {
    return Module["asm"]["mq"].apply(null, arguments)
};
var _memset = Module["_memset"] = function() {
    return Module["asm"]["nq"].apply(null, arguments)
};
var _setThrew = Module["_setThrew"] = function() {
    return Module["asm"]["oq"].apply(null, arguments)
};
var stackAlloc = Module["stackAlloc"] = function() {
    return Module["asm"]["Ks"].apply(null, arguments)
};
var stackRestore = Module["stackRestore"] = function() {
    return Module["asm"]["Ls"].apply(null, arguments)
};
var stackSave = Module["stackSave"] = function() {
    return Module["asm"]["Ms"].apply(null, arguments)
};
var dynCall_di = Module["dynCall_di"] = function() {
    return Module["asm"]["pq"].apply(null, arguments)
};
var dynCall_did = Module["dynCall_did"] = function() {
    return Module["asm"]["qq"].apply(null, arguments)
};
var dynCall_didd = Module["dynCall_didd"] = function() {
    return Module["asm"]["rq"].apply(null, arguments)
};
var dynCall_didi = Module["dynCall_didi"] = function() {
    return Module["asm"]["sq"].apply(null, arguments)
};
var dynCall_dif = Module["dynCall_dif"] = function() {
    return Module["asm"]["tq"].apply(null, arguments)
};
var dynCall_difi = Module["dynCall_difi"] = function() {
    return Module["asm"]["uq"].apply(null, arguments)
};
var dynCall_dii = Module["dynCall_dii"] = function() {
    return Module["asm"]["vq"].apply(null, arguments)
};
var dynCall_diid = Module["dynCall_diid"] = function() {
    return Module["asm"]["wq"].apply(null, arguments)
};
var dynCall_diidd = Module["dynCall_diidd"] = function() {
    return Module["asm"]["xq"].apply(null, arguments)
};
var dynCall_diii = Module["dynCall_diii"] = function() {
    return Module["asm"]["yq"].apply(null, arguments)
};
var dynCall_diij = Module["dynCall_diij"] = function() {
    return Module["asm"]["zq"].apply(null, arguments)
};
var dynCall_ff = Module["dynCall_ff"] = function() {
    return Module["asm"]["Aq"].apply(null, arguments)
};
var dynCall_fi = Module["dynCall_fi"] = function() {
    return Module["asm"]["Bq"].apply(null, arguments)
};
var dynCall_fid = Module["dynCall_fid"] = function() {
    return Module["asm"]["Cq"].apply(null, arguments)
};
var dynCall_fif = Module["dynCall_fif"] = function() {
    return Module["asm"]["Dq"].apply(null, arguments)
};
var dynCall_fii = Module["dynCall_fii"] = function() {
    return Module["asm"]["Eq"].apply(null, arguments)
};
var dynCall_fiif = Module["dynCall_fiif"] = function() {
    return Module["asm"]["Fq"].apply(null, arguments)
};
var dynCall_fiiif = Module["dynCall_fiiif"] = function() {
    return Module["asm"]["Gq"].apply(null, arguments)
};
var dynCall_i = Module["dynCall_i"] = function() {
    return Module["asm"]["Hq"].apply(null, arguments)
};
var dynCall_id = Module["dynCall_id"] = function() {
    return Module["asm"]["Iq"].apply(null, arguments)
};
var dynCall_ii = Module["dynCall_ii"] = function() {
    return Module["asm"]["Jq"].apply(null, arguments)
};
var dynCall_iid = Module["dynCall_iid"] = function() {
    return Module["asm"]["Kq"].apply(null, arguments)
};
var dynCall_iidd = Module["dynCall_iidd"] = function() {
    return Module["asm"]["Lq"].apply(null, arguments)
};
var dynCall_iidiiii = Module["dynCall_iidiiii"] = function() {
    return Module["asm"]["Mq"].apply(null, arguments)
};
var dynCall_iif = Module["dynCall_iif"] = function() {
    return Module["asm"]["Nq"].apply(null, arguments)
};
var dynCall_iiff = Module["dynCall_iiff"] = function() {
    return Module["asm"]["Oq"].apply(null, arguments)
};
var dynCall_iiffff = Module["dynCall_iiffff"] = function() {
    return Module["asm"]["Pq"].apply(null, arguments)
};
var dynCall_iiffi = Module["dynCall_iiffi"] = function() {
    return Module["asm"]["Qq"].apply(null, arguments)
};
var dynCall_iifi = Module["dynCall_iifi"] = function() {
    return Module["asm"]["Rq"].apply(null, arguments)
};
var dynCall_iii = Module["dynCall_iii"] = function() {
    return Module["asm"]["Sq"].apply(null, arguments)
};
var dynCall_iiid = Module["dynCall_iiid"] = function() {
    return Module["asm"]["Tq"].apply(null, arguments)
};
var dynCall_iiif = Module["dynCall_iiif"] = function() {
    return Module["asm"]["Uq"].apply(null, arguments)
};
var dynCall_iiiff = Module["dynCall_iiiff"] = function() {
    return Module["asm"]["Vq"].apply(null, arguments)
};
var dynCall_iiifi = Module["dynCall_iiifi"] = function() {
    return Module["asm"]["Wq"].apply(null, arguments)
};
var dynCall_iiii = Module["dynCall_iiii"] = function() {
    return Module["asm"]["Xq"].apply(null, arguments)
};
var dynCall_iiiif = Module["dynCall_iiiif"] = function() {
    return Module["asm"]["Yq"].apply(null, arguments)
};
var dynCall_iiiii = Module["dynCall_iiiii"] = function() {
    return Module["asm"]["Zq"].apply(null, arguments)
};
var dynCall_iiiiid = Module["dynCall_iiiiid"] = function() {
    return Module["asm"]["_q"].apply(null, arguments)
};
var dynCall_iiiiif = Module["dynCall_iiiiif"] = function() {
    return Module["asm"]["$q"].apply(null, arguments)
};
var dynCall_iiiiii = Module["dynCall_iiiiii"] = function() {
    return Module["asm"]["ar"].apply(null, arguments)
};
var dynCall_iiiiiid = Module["dynCall_iiiiiid"] = function() {
    return Module["asm"]["br"].apply(null, arguments)
};
var dynCall_iiiiiii = Module["dynCall_iiiiiii"] = function() {
    return Module["asm"]["cr"].apply(null, arguments)
};
var dynCall_iiiiiiii = Module["dynCall_iiiiiiii"] = function() {
    return Module["asm"]["dr"].apply(null, arguments)
};
var dynCall_iiiiiiiii = Module["dynCall_iiiiiiiii"] = function() {
    return Module["asm"]["er"].apply(null, arguments)
};
var dynCall_iiiiiiiiii = Module["dynCall_iiiiiiiiii"] = function() {
    return Module["asm"]["fr"].apply(null, arguments)
};
var dynCall_iiiiij = Module["dynCall_iiiiij"] = function() {
    return Module["asm"]["gr"].apply(null, arguments)
};
var dynCall_iiij = Module["dynCall_iiij"] = function() {
    return Module["asm"]["hr"].apply(null, arguments)
};
var dynCall_iij = Module["dynCall_iij"] = function() {
    return Module["asm"]["ir"].apply(null, arguments)
};
var dynCall_iiji = Module["dynCall_iiji"] = function() {
    return Module["asm"]["jr"].apply(null, arguments)
};
var dynCall_j = Module["dynCall_j"] = function() {
    return Module["asm"]["kr"].apply(null, arguments)
};
var dynCall_ji = Module["dynCall_ji"] = function() {
    return Module["asm"]["lr"].apply(null, arguments)
};
var dynCall_jii = Module["dynCall_jii"] = function() {
    return Module["asm"]["mr"].apply(null, arguments)
};
var dynCall_jiii = Module["dynCall_jiii"] = function() {
    return Module["asm"]["nr"].apply(null, arguments)
};
var dynCall_jiij = Module["dynCall_jiij"] = function() {
    return Module["asm"]["or"].apply(null, arguments)
};
var dynCall_jiji = Module["dynCall_jiji"] = function() {
    return Module["asm"]["pr"].apply(null, arguments)
};
var dynCall_v = Module["dynCall_v"] = function() {
    return Module["asm"]["qr"].apply(null, arguments)
};
var dynCall_vd = Module["dynCall_vd"] = function() {
    return Module["asm"]["rr"].apply(null, arguments)
};
var dynCall_vf = Module["dynCall_vf"] = function() {
    return Module["asm"]["sr"].apply(null, arguments)
};
var dynCall_vff = Module["dynCall_vff"] = function() {
    return Module["asm"]["tr"].apply(null, arguments)
};
var dynCall_vffff = Module["dynCall_vffff"] = function() {
    return Module["asm"]["ur"].apply(null, arguments)
};
var dynCall_vi = Module["dynCall_vi"] = function() {
    return Module["asm"]["vr"].apply(null, arguments)
};
var dynCall_vid = Module["dynCall_vid"] = function() {
    return Module["asm"]["wr"].apply(null, arguments)
};
var dynCall_vidd = Module["dynCall_vidd"] = function() {
    return Module["asm"]["xr"].apply(null, arguments)
};
var dynCall_viddd = Module["dynCall_viddd"] = function() {
    return Module["asm"]["yr"].apply(null, arguments)
};
var dynCall_vidddd = Module["dynCall_vidddd"] = function() {
    return Module["asm"]["zr"].apply(null, arguments)
};
var dynCall_viddi = Module["dynCall_viddi"] = function() {
    return Module["asm"]["Ar"].apply(null, arguments)
};
var dynCall_viddiii = Module["dynCall_viddiii"] = function() {
    return Module["asm"]["Br"].apply(null, arguments)
};
var dynCall_viddiiii = Module["dynCall_viddiiii"] = function() {
    return Module["asm"]["Cr"].apply(null, arguments)
};
var dynCall_vidi = Module["dynCall_vidi"] = function() {
    return Module["asm"]["Dr"].apply(null, arguments)
};
var dynCall_vidii = Module["dynCall_vidii"] = function() {
    return Module["asm"]["Er"].apply(null, arguments)
};
var dynCall_vif = Module["dynCall_vif"] = function() {
    return Module["asm"]["Fr"].apply(null, arguments)
};
var dynCall_viff = Module["dynCall_viff"] = function() {
    return Module["asm"]["Gr"].apply(null, arguments)
};
var dynCall_viffdi = Module["dynCall_viffdi"] = function() {
    return Module["asm"]["Hr"].apply(null, arguments)
};
var dynCall_vifff = Module["dynCall_vifff"] = function() {
    return Module["asm"]["Ir"].apply(null, arguments)
};
var dynCall_viffff = Module["dynCall_viffff"] = function() {
    return Module["asm"]["Jr"].apply(null, arguments)
};
var dynCall_vifffff = Module["dynCall_vifffff"] = function() {
    return Module["asm"]["Kr"].apply(null, arguments)
};
var dynCall_viffi = Module["dynCall_viffi"] = function() {
    return Module["asm"]["Lr"].apply(null, arguments)
};
var dynCall_viffii = Module["dynCall_viffii"] = function() {
    return Module["asm"]["Mr"].apply(null, arguments)
};
var dynCall_vifi = Module["dynCall_vifi"] = function() {
    return Module["asm"]["Nr"].apply(null, arguments)
};
var dynCall_vii = Module["dynCall_vii"] = function() {
    return Module["asm"]["Or"].apply(null, arguments)
};
var dynCall_viid = Module["dynCall_viid"] = function() {
    return Module["asm"]["Pr"].apply(null, arguments)
};
var dynCall_viidd = Module["dynCall_viidd"] = function() {
    return Module["asm"]["Qr"].apply(null, arguments)
};
var dynCall_viiddd = Module["dynCall_viiddd"] = function() {
    return Module["asm"]["Rr"].apply(null, arguments)
};
var dynCall_viidddi = Module["dynCall_viidddi"] = function() {
    return Module["asm"]["Sr"].apply(null, arguments)
};
var dynCall_viiddi = Module["dynCall_viiddi"] = function() {
    return Module["asm"]["Tr"].apply(null, arguments)
};
var dynCall_viidi = Module["dynCall_viidi"] = function() {
    return Module["asm"]["Ur"].apply(null, arguments)
};
var dynCall_viidii = Module["dynCall_viidii"] = function() {
    return Module["asm"]["Vr"].apply(null, arguments)
};
var dynCall_viif = Module["dynCall_viif"] = function() {
    return Module["asm"]["Wr"].apply(null, arguments)
};
var dynCall_viiff = Module["dynCall_viiff"] = function() {
    return Module["asm"]["Xr"].apply(null, arguments)
};
var dynCall_viifffii = Module["dynCall_viifffii"] = function() {
    return Module["asm"]["Yr"].apply(null, arguments)
};
var dynCall_viifffiii = Module["dynCall_viifffiii"] = function() {
    return Module["asm"]["Zr"].apply(null, arguments)
};
var dynCall_viiffi = Module["dynCall_viiffi"] = function() {
    return Module["asm"]["_r"].apply(null, arguments)
};
var dynCall_viiffiiii = Module["dynCall_viiffiiii"] = function() {
    return Module["asm"]["$r"].apply(null, arguments)
};
var dynCall_viiffiiiid = Module["dynCall_viiffiiiid"] = function() {
    return Module["asm"]["as"].apply(null, arguments)
};
var dynCall_viifi = Module["dynCall_viifi"] = function() {
    return Module["asm"]["bs"].apply(null, arguments)
};
var dynCall_viii = Module["dynCall_viii"] = function() {
    return Module["asm"]["cs"].apply(null, arguments)
};
var dynCall_viiid = Module["dynCall_viiid"] = function() {
    return Module["asm"]["ds"].apply(null, arguments)
};
var dynCall_viiiddd = Module["dynCall_viiiddd"] = function() {
    return Module["asm"]["es"].apply(null, arguments)
};
var dynCall_viiiddi = Module["dynCall_viiiddi"] = function() {
    return Module["asm"]["fs"].apply(null, arguments)
};
var dynCall_viiiddiid = Module["dynCall_viiiddiid"] = function() {
    return Module["asm"]["gs"].apply(null, arguments)
};
var dynCall_viiidii = Module["dynCall_viiidii"] = function() {
    return Module["asm"]["hs"].apply(null, arguments)
};
var dynCall_viiiffiff = Module["dynCall_viiiffiff"] = function() {
    return Module["asm"]["is"].apply(null, arguments)
};
var dynCall_viiifiiii = Module["dynCall_viiifiiii"] = function() {
    return Module["asm"]["js"].apply(null, arguments)
};
var dynCall_viiii = Module["dynCall_viiii"] = function() {
    return Module["asm"]["ks"].apply(null, arguments)
};
var dynCall_viiiid = Module["dynCall_viiiid"] = function() {
    return Module["asm"]["ls"].apply(null, arguments)
};
var dynCall_viiiii = Module["dynCall_viiiii"] = function() {
    return Module["asm"]["ms"].apply(null, arguments)
};
var dynCall_viiiiid = Module["dynCall_viiiiid"] = function() {
    return Module["asm"]["ns"].apply(null, arguments)
};
var dynCall_viiiiii = Module["dynCall_viiiiii"] = function() {
    return Module["asm"]["os"].apply(null, arguments)
};
var dynCall_viiiiiid = Module["dynCall_viiiiiid"] = function() {
    return Module["asm"]["ps"].apply(null, arguments)
};
var dynCall_viiiiiidd = Module["dynCall_viiiiiidd"] = function() {
    return Module["asm"]["qs"].apply(null, arguments)
};
var dynCall_viiiiiii = Module["dynCall_viiiiiii"] = function() {
    return Module["asm"]["rs"].apply(null, arguments)
};
var dynCall_viiiiiiid = Module["dynCall_viiiiiiid"] = function() {
    return Module["asm"]["ss"].apply(null, arguments)
};
var dynCall_viiiiiiii = Module["dynCall_viiiiiiii"] = function() {
    return Module["asm"]["ts"].apply(null, arguments)
};
var dynCall_viiiiiiiii = Module["dynCall_viiiiiiiii"] = function() {
    return Module["asm"]["us"].apply(null, arguments)
};
var dynCall_viiiiiiiiii = Module["dynCall_viiiiiiiiii"] = function() {
    return Module["asm"]["vs"].apply(null, arguments)
};
var dynCall_viiij = Module["dynCall_viiij"] = function() {
    return Module["asm"]["ws"].apply(null, arguments)
};
var dynCall_viiijiii = Module["dynCall_viiijiii"] = function() {
    return Module["asm"]["xs"].apply(null, arguments)
};
var dynCall_viij = Module["dynCall_viij"] = function() {
    return Module["asm"]["ys"].apply(null, arguments)
};
var dynCall_viiji = Module["dynCall_viiji"] = function() {
    return Module["asm"]["zs"].apply(null, arguments)
};
var dynCall_viijidd = Module["dynCall_viijidd"] = function() {
    return Module["asm"]["As"].apply(null, arguments)
};
var dynCall_viijii = Module["dynCall_viijii"] = function() {
    return Module["asm"]["Bs"].apply(null, arguments)
};
var dynCall_viijiii = Module["dynCall_viijiii"] = function() {
    return Module["asm"]["Cs"].apply(null, arguments)
};
var dynCall_viijj = Module["dynCall_viijj"] = function() {
    return Module["asm"]["Ds"].apply(null, arguments)
};
var dynCall_vij = Module["dynCall_vij"] = function() {
    return Module["asm"]["Es"].apply(null, arguments)
};
var dynCall_vijd = Module["dynCall_vijd"] = function() {
    return Module["asm"]["Fs"].apply(null, arguments)
};
var dynCall_viji = Module["dynCall_viji"] = function() {
    return Module["asm"]["Gs"].apply(null, arguments)
};
var dynCall_vijiii = Module["dynCall_vijiii"] = function() {
    return Module["asm"]["Hs"].apply(null, arguments)
};
var dynCall_vijj = Module["dynCall_vijj"] = function() {
    return Module["asm"]["Is"].apply(null, arguments)
};
var dynCall_vijji = Module["dynCall_vijji"] = function() {
    return Module["asm"]["Js"].apply(null, arguments)
};
Module["asm"] = asm;
Module["setValue"] = setValue;
Module["allocate"] = allocate;
Module["getMemory"] = getMemory;
Module["UTF8ToString"] = UTF8ToString;
Module["stringToUTF8"] = stringToUTF8;
Module["lengthBytesUTF8"] = lengthBytesUTF8;
Module["stackTrace"] = stackTrace;
Module["writeArrayToMemory"] = writeArrayToMemory;
Module["addRunDependency"] = addRunDependency;
Module["removeRunDependency"] = removeRunDependency;
Module["FS_createFolder"] = FS.createFolder;
Module["FS_createPath"] = FS.createPath;
Module["FS_createDataFile"] = FS.createDataFile;
Module["FS_createPreloadedFile"] = FS.createPreloadedFile;
Module["FS_createLazyFile"] = FS.createLazyFile;
Module["FS_createLink"] = FS.createLink;
Module["FS_createDevice"] = FS.createDevice;
Module["FS_unlink"] = FS.unlink;
Module["calledRun"] = calledRun;
var calledRun;

function ExitStatus(status) {
    this.name = "ExitStatus";
    this.message = "Program terminated with exit(" + status + ")";
    this.status = status
}
var calledMain = false;
dependenciesFulfilled = function runCaller() {
    if (!calledRun) run();
    if (!calledRun) dependenciesFulfilled = runCaller
};

function callMain(args) {
    var entryFunction = Module["_main"];
    args = args || [];
    var argc = args.length + 1;
    var argv = stackAlloc((argc + 1) * 4);
    HEAP32[argv >> 2] = allocateUTF8OnStack(thisProgram);
    for (var i = 1; i < argc; i++) {
        HEAP32[(argv >> 2) + i] = allocateUTF8OnStack(args[i - 1])
    }
    HEAP32[(argv >> 2) + argc] = 0;
    try {
        var ret = entryFunction(argc, argv);
        exit(ret, true)
    } catch (e) {
        if (e instanceof ExitStatus) {
            return
        } else if (e == "SimulateInfiniteLoop") {
            noExitRuntime = true;
            return
        } else {
            var toLog = e;
            if (e && typeof e === "object" && e.stack) {
                toLog = [e, e.stack]
            }
            err("exception thrown: " + toLog);
            quit_(1, e)
        }
    } finally {
        calledMain = true
    }
}

function run(args) {
    args = args || arguments_;
    if (runDependencies > 0) {
        return
    }
    preRun();
    if (runDependencies > 0) return;

    function doRun() {
        if (calledRun) return;
        calledRun = true;
        Module["calledRun"] = true;
        if (ABORT) return;
        initRuntime();
        preMain();
        if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
        if (shouldRunNow) callMain(args);
        postRun()
    }
    if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(function() {
            setTimeout(function() {
                Module["setStatus"]("")
            }, 1);
            doRun()
        }, 1)
    } else {
        doRun()
    }
}
Module["run"] = run;

function exit(status, implicit) {
    if (implicit && noExitRuntime && status === 0) {
        return
    }
    if (noExitRuntime) {} else {
        ABORT = true;
        EXITSTATUS = status;
        exitRuntime();
        if (Module["onExit"]) Module["onExit"](status)
    }
    quit_(status, new ExitStatus(status))
}
if (Module["preInit"]) {
    if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
    while (Module["preInit"].length > 0) {
        Module["preInit"].pop()()
    }
}
var shouldRunNow = true;
if (Module["noInitialRun"]) shouldRunNow = false;
noExitRuntime = true;
run();