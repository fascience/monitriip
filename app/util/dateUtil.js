let moment = require('moment');
let momentTimezone = require('moment-timezone');

const formato = {
    DATA_DMA_BARRA: 'DD/MM/YYYY',
    DATA_DMA_TRACO: 'DD-MM-YYYY',
    DATA_AMD_BARRA: 'YYYY/MM/DD',
    DATA_AMD_TRACO: 'YYYY-MM-DD',
    DATAHORA_DMA_BARRA: 'DD/MM/YYYY hh:mm:ss',
    DATAHORA_DMA_TRACO: 'DD-MM-YYYY hh:mm:ss',
    DATAHORA_AMD_BARRA: 'YYYY/MM/DD hh:mm:ss',
    DATAHORA_AMD_TRACO: 'YYYY-MM-DD hh:mm:ss',
    DATA_COMPLETA_MDA_BARRA: 'DD/MM/YYYY hh:mm:ss:sss',
    DATA_COMPLETA_AMD_BARRA: 'YYYY/MM/DD hh:mm:ss:sss',
    HORA_MIN: 'hh:mm:ss',
    HORA_MIN_SEG: 'hh:mm:ss',
    HORA_COMPLETA: 'hh:mm:ss:sss'
}

const tipoRetorno = {
    DATA: 1,
    STRING: 2
}

class DateUtil{
    constructor(){
        this._formato = formato;
        this._tipoRetorno = tipoRetorno;
    }

    validar(data, formato){
        try{                       
            return moment(data, formato, true).isValid();           
        }
        catch(e){
            console.log(e);

            return false;
        }
    }

    formataDataHora(dataHora, format, timezone, tipo) {
        if(!format) format = formato.DATAHORA_AMD_BARRA;
        if(!timezone) timezone = 'America/Sao_Paulo';
        if(!tipo) tipo = tipoRetorno.STRING;

        return this.aplicaTimeZone(dataHora, format, timezone, tipo);
    }

    aplicaTimeZone(dataHora, format, timezone, tipo){
        let dh = momentTimezone.tz(dataHora, timezone);

        return (tipo === tipoRetorno.STRING) ? dh.format(format) : dh.toDate();
    }

    get formato(){
        return this._formato;
    }

    get tipoRetorno(){
        return this._tipoRetorno;
    }

    getMesVigente(data){
        return moment.months()[moment(data).format('M') -1];
    }
}

module.exports = () => DateUtil;