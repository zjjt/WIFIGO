import React, {Component} from 'react';
import {DatePicker, IconButton, TextField} from "material-ui";
import ActionDateRange from 'material-ui/svg-icons/action/date-range';
import format from 'date-fns/format'
import parse from 'date-fns/parse'

export default class DatePickerField extends Component{

   constructor(props){
      super(props);

      this.state = {
        selectedDate: new Date(),
        dateText: format(new Date(), 'MM/DD/YYYY')
      };
   }

   handleChangeDatePicker = (event, date) => {
      this.setState({selectedDate: date, dateText:format(date, 'MM/DD/YYYY')});
   };

   handleDateInputChange = (event, value) => {
      this.setState({dateText:value});
   };

   handleDateInputBlur = (value) => {
     let parsedDate = parse(value, 'MM/DD/YYYY');

     if(this.isADate(parsedDate)){
        this.setState({selectedDate:parsedDate});
     }
     else{
        this.setState({dateText:format(this.state.selectedDate, 'MM/DD/YYYY')});
     }
   };

   isADate = (maybeDate) => {
      if ( Object.prototype.toString.call(maybeDate) === "[object Date]" ) {
         if ( isNaN( maybeDate.getTime() ) ) {
            return false;
         }
         else {
            return true;
         }
      }
      else {
         return false;
      }
   };

   render(){

      let dateInputWidth = "150px";
      let datePickerMargin = "-185px";

      return (
         <div style={{display: "flex"}}>
            <TextField
               style={{width:dateInputWidth}}
               value={this.state.dateText}
               onChange={this.handleDateInputChange}
               onBlur={(event) => this.handleDateInputBlur(event.currentTarget.value)}
            />

            <IconButton style={{opacity:"0.65"}}
                        onClick={() => this.datePicker.focus()}>
               <ActionDateRange />
            </IconButton>

            <div style={{width:"0px", height:"0px", marginLeft:datePickerMargin}}>
               <DatePicker
                  id="dataPicker"
                  floatingLabelText={''}
                  value={this.state.selectedDate}
                  errorText={''}
                  disabled={false}
                  formatDate={date => { return format(date, 'MM/DD/YYYY') } }
                  autoOk
                  container="inline"
                  fullWidth
                  onChange={this.handleChangeDatePicker}
                  ref={c => {
                     this.datePicker = c
                  }}
               />
            </div>
         </div>
      )
   }

}