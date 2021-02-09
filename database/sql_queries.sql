/*Alertas ganadas*/
UPDATE alerts 
INNER JOIN iq_values on DATE_FORMAT(alerts.date, "%Y-%m-%d %H:%i") = iq_values.date
SET result=1 
where alerts.direction_alert = 1 and alerts.value < iq_values.close;

UPDATE alerts 
INNER JOIN iq_values on DATE_FORMAT(alerts.date, "%Y-%m-%d %H:%i") = iq_values.date
SET result=1 
where alerts.direction_alert = -1 and alerts.value > iq_values.close;

/*Alertas perdidas*/
UPDATE alerts 
INNER JOIN iq_values on DATE_FORMAT(alerts.date, "%Y-%m-%d %H:%i") = iq_values.date
SET result=-1 
where alerts.direction_alert = 1 and alerts.value > iq_values.close;

UPDATE alerts 
INNER JOIN iq_values on DATE_FORMAT(alerts.date, "%Y-%m-%d %H:%i") = iq_values.date
SET result=-1 
where alerts.direction_alert = -1 and alerts.value < iq_values.close;

/*Alertas empatadas*/
UPDATE alerts 
INNER JOIN iq_values on DATE_FORMAT(alerts.date, "%Y-%m-%d %H:%i") = iq_values.date
SET result=0 
where alerts.value = iq_values.close;

/*Comparación de alertas*/
SELECT alerts.direction_alert, alerts.value, iq_values.close FROM `alerts` INNER JOIN iq_values on DATE_FORMAT(alerts.date, "%Y-%m-%d %H:%i") = iq_values.date;

/*Resultados*/
SELECT 
	ganadas.ganadas, 
	perdidas.perdidas, 
	empatadas.empatadas,
	(ganadas.ganadas * 100)/(ganadas.ganadas + perdidas.perdidas + empatadas.empatadas) as porcentaje_ganadas,
	(perdidas.perdidas * 100)/(ganadas.ganadas + perdidas.perdidas + empatadas.empatadas) as porcentaje_perdidas,
	(empatadas.empatadas * 100)/(ganadas.ganadas + perdidas.perdidas + empatadas.empatadas) as porcentaje_empatadas
from 
	(SELECT count(alerts.result) ganadas, AVG(alerts.probability) probability_avg FROM `alerts` WHERE alerts.result = 1 AND alerts.probability >= 60 AND date > '2019-12-11 21:00') as ganadas, 
	(SELECT count(alerts.result) perdidas, AVG(alerts.probability) probability_avg FROM `alerts` WHERE alerts.result = -1 AND alerts.probability >= 60 AND date > '2019-12-11 21:00') as perdidas,
	(SELECT count(alerts.result) empatadas, AVG(alerts.probability) probability_avg FROM `alerts` WHERE alerts.result = 0 AND alerts.probability >= 60 AND date > '2019-12-11 21:00') as empatadas;

/*Agrupadas por minuto*/
SELECT alerts.direction_alert, AVG(alerts.result) as promedio_results, DATE_FORMAT(alerts.date, "%Y-%m-%d %H:%i") as fecha FROM `alerts` WHERE date > '2019-12-11 21:00' GROUP BY DATE_FORMAT(alerts.date, "%Y-%m-%d %H:%i")

/*Cuenta acertadas o no acertadas*/
SELECT count(*) from (SELECT alerts.direction_alert, AVG(alerts.result) as promedio_results, DATE_FORMAT(alerts.date, "%Y-%m-%d %H:%i") as fecha FROM `alerts` GROUP BY DATE_FORMAT(alerts.date, "%Y-%m-%d %H:%i")) as t where t.promedio_results > 0 AND t.fecha >= '2019-12-11 21:00';

/*Borrar datos*/
DELETE FROM iq_values WHERE 1;
DELETE FROM levels WHERE 1;
DELETE FROM supports_resistors WHERE 1;
DELETE FROM alerts WHERE 1;

UPDATE `currency_pairs` SET `avg_candles_size` = NULL, next_level_upper = NULL, next_level_lowwer = NULL;