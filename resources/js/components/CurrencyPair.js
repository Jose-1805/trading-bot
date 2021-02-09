import React, { Component } from 'react';

import { Card, Icon, Statistic, Container, Button, Grid, Header } from 'semantic-ui-react';

class CurrencyPair extends Component {

    constructor(props) {
        super(props);
    }

    render() {
    	const { name, next_bullish_entry, next_bear_entry, probability_bullish_entry, probability_bear_entry, avg_candles_size } = this.props.data;

        let color = 'color_white';
        let color_currency = 'blue';

        let proximity_for_color = avg_candles_size * 3;

        proximity_for_color = proximity_for_color > 30?30:proximity_for_color;
        proximity_for_color = proximity_for_color < 10?10:proximity_for_color;

        if(this.props.data.launch_alerts == 1 && 'level_distance_upper' in this.props.data && this.props.data.level_distance_upper && this.props.data.level_distance_upper < proximity_for_color){
            color = 'color_red lighten-4';
            color_currency = 'red';
        }else if(this.props.data.launch_alerts == 1 && 'level_distance_lowwer' in this.props.data && this.props.data.level_distance_lowwer && this.props.data.level_distance_lowwer < proximity_for_color){
            color = 'color_green lighten-4';
            color_currency = 'green';
        }

        const state_button = ('alert' in this.props)?(this.props.alert.direction_alert == 1?true:false):null;

        let bullish_entry_view = "";

        if(probability_bullish_entry)
            bullish_entry_view = <Grid.Column>
                    <Statistic size='tiny' color="green">
                        <Statistic.Value>{probability_bullish_entry+'%'}</Statistic.Value>
                        <Statistic.Label>En la sigUiente entrada al alza</Statistic.Label>
                    </Statistic>
                    <Header as='h5' textAlign='center'>{next_bullish_entry}</Header>
                </Grid.Column>

        let bear_entry_view = "";

        if(probability_bear_entry)
            bear_entry_view = <Grid.Column>
                        <Statistic size='tiny' color="red">
                            <Statistic.Value>{probability_bear_entry+'%'}</Statistic.Value>
                            <Statistic.Label>En la sigUiente entrada a la baja</Statistic.Label>
                        </Statistic>
                        <Header as='h5' textAlign='center'>{next_bear_entry}</Header>
                    </Grid.Column>

        let message = "";
        if(!probability_bear_entry && !probability_bullish_entry)
            message = <Grid.Column>En este momento no tenemos nuevas entradas identificadas</Grid.Column>

        return (
            <Card className={color+' padding-top-10'}>
                <Statistic color={color_currency}>
                    <Statistic.Value>{name.replace('-','/')}</Statistic.Value>
                    <Statistic.Label>Divisas</Statistic.Label>
                </Statistic>
                <Card.Content>
                    {/*<Card.Header>
                        <Statistic size='tiny' horizontal>
                            <Statistic.Value>{percentage_between_levels+'%'}</Statistic.Value>
                            <Statistic.Label>Posibilidad de alerta</Statistic.Label>
                        </Statistic>
                    </Card.Header>*/}
                    
                    <Card.Description>
                        <Grid columns={probability_bear_entry && probability_bullish_entry?2:1}>
                            {bullish_entry_view}
                            {bear_entry_view}                                
                            {message}                                
                        </Grid>
                    </Card.Description>
                </Card.Content>
                <Card.Content extra textAlign='center'>
                    <Button disabled={(state_button == null?true:false)} positive={state_button == null?false:state_button} negative={state_button == null?false:!state_button} size='huge' fluid>Entrar YA!!</Button>
                </Card.Content>
            </Card>
        );
    }
}

export default CurrencyPair;
