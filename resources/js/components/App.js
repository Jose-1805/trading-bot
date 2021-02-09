import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Container, Card } from 'semantic-ui-react';
import CurrencyPair from './CurrencyPair';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data:[],
            alert:null
        };

        //escuchador para alertas enviadas desde el servidor
        window.Echo.channel('home').listen('NewMessage', e => {
            //actualzación total de datos
            if(e.message.type == 'full_data'){
                this.setState({
                    data:e.message.data
                });

                //actualización parcial de datos
            }else if(e.message.type == 'data'){
                //datos actuales
                let currency_pairs = this.state.data;

                //nuevos datos
                let updated_currency_pairs = [];
                
                //se recorren los nuevos datos
                _.map(currency_pairs, (el, i) => {
                    //determina si ya se agrego el item del ciclo
                    let currency_pair_is_add = false;

                    _.map(e.message.data, (el_, i_) => {
                        //si el par de divisas del ciclo llega 
                        //en los datos, se actualiza
                        if(el.id == el_.id){
                            updated_currency_pairs.push(el_);
                            currency_pair_is_add = true;
                        }
                    })

                    //si el par de divisas del ciclo no llega
                    //en los datos se deja el actual
                    if(!currency_pair_is_add){
                       updated_currency_pairs.push(el); 
                    }  
                })

                this.setState({
                    data:updated_currency_pairs
                });

                //alertas
            }else if(e.message.type == 'alert'){
                this.setState({
                    alert:e.message.data
                });

                setTimeout(() => {
                    this.setState({
                        alert:null
                    });
                }, 300);
            }
        })
    }

    render() {
        const currency_pairs = this.state.data;

        const items = [];

        _.map(currency_pairs, (el, i) => {
            if(this.state.alert && this.state.alert.currency_pair_id == el.id){
                items.push(<CurrencyPair data={el} key={i} alert={this.state.alert}/>)
            }else{
                items.push(<CurrencyPair data={el} key={i} />)
            }
        })

        return (
            <Container className='padding-top-50'>
                <Card.Group centered>
                    {items}
                </Card.Group>
            </Container>
        );
    }
}

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
