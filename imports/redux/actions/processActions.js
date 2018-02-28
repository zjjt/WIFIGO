export const RESET="RESET";
export const FINDUPROCESSN='FINDUPROCESSN';//non
export const FINDUPROCESSO='FINDUPROCESSO';//oui
export const SUBMITALLOWED='SUBMITALLOWED';//oui
export const SUBMITNOTALLOWED='SUBMITNOTALLOWED';//oui
export const QUERYPARAMS='QUERYPARAMS';
export const CLIENTINFO='CLIENTINFO';

export function getParams(c){
	return{
		type:QUERYPARAMS,
		urlParams:c
	}
}
export function getClient(c){
	return{
		type:CLIENTINFO,
		client:c
	}
}
export function finprocessnon(){
	return{
		type:FINDUPROCESSN
	}
}
export function resetProcess(){
	return{
		type:RESET
	}
}

export function finprocessoui(){
	return{
		type:FINDUPROCESSO
	}
}

export function modiformCanSubmit(){
	return{
		type:SUBMITALLOWED
	}
}

export function modiformCantSubmit(){
	return{
		type:SUBMITNOTALLOWED
	}
}