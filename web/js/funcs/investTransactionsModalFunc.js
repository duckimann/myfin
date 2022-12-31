import { DialogUtils } from '../utils/dialogUtils.js'
import { ValidationUtils } from '../utils/validationUtils.js'
import { PickerUtils } from '../utils/pickerUtils.js'
import { DateUtils } from '../utils/dateUtils.js'
import { Localization } from '../utils/localization.js'

export const InvestTransactionsModalFunc = {
  buildAddNewTransactionModal: (modalDivID = '#modal-global', assetsList, addTransactionBtnClickCallback) => {
    $('#modal-global').modal('open')
    let txt = `
                <div class="row row-no-margin-bottom">
                    <div class="input-field col s8">
                        <h4>${Localization.getString('investments.addNewTransaction')}</h4>
                    </div>
                    <div class="input-field col s4">
                        <span class="select2-top-label">${Localization.getString('investments.typeOfTransaction')}</span>
                        <select class="select-trxs-types" name="types">
                            <option value="${MYFIN.INVEST_TRX_TYPES.BUY.id}">${MYFIN.INVEST_TRX_TYPES.BUY.name}</option>
                            <option value="${MYFIN.INVEST_TRX_TYPES.SELL.id}">${MYFIN.INVEST_TRX_TYPES.SELL.name}</option>
                        </select>
                    </div>
                </div>
                
                    <form class="col s12">
                        <div class="row row-no-margin-bottom">
                            <div class="input-field col s2">
                                <i class="material-icons prefix">euro_symbol</i>
                                <input id="trx_amount" type="number" step=".01" class="validate">
                                <label for="trx_amount">${Localization.getString('common.value')} (€)</label>
                            </div>
                            <div class="input-field col s2">
                                <i class="material-icons prefix">fiber_smart_record</i>
                                <input id="trx_units" type="number" step=".0001" class="validate">
                                <label for="trx_units">${Localization.getString('investments.units')}</label>
                            </div>  
                             <div class="input-field col s3">
                                <i class="material-icons prefix">date_range</i>
                                <input id="trx_date" type="text" class="datepicker input-field">
                                <label for="trx_date">${Localization.getString('transactions.dateOfTransaction')}</label>
                            </div>               
                            <div class="input-field col s3 offset-s2">
                            <span class="select2-top-label">${Localization.getString('investments.associatedAsset')}</span>
                                <select class="select-trxs-asset" name="assets" style="width: 100%;">
                                    ${assetsList.map(asset => InvestTransactionsModalFunc.renderAssetsSelectOption(asset)).join('')}
                                </select>   
                            </div>
                        </div>
                        <div class="row row-no-margin-bottom col s12">                     
                            <div class="col s12">
                                <div class="input-field col s12">
                                    <i class="material-icons prefix">description</i>
                                    <textarea id="trx-description" class="materialize-textarea"></textarea>
                                    <label for="trx-description">${Localization.getString('investments.observations')}</label>
                                </div>
                            </div> 
                        </div>                             
                    </form>
                </div>
                `

    let actionLinks = `<a  class="modal-close waves-effect waves-green btn-flat enso-blue-bg enso-border white-text">${Localization.getString(
      'common.cancel')}</a>
                    <a id="add_trx_btn" class="waves-effect waves-red btn-flat enso-salmon-bg enso-border white-text">${Localization.getString(
      'common.add')}</a>`
    $('#modal-global .modal-content').html(txt)
    $('#modal-global .modal-footer').html(actionLinks)

    $('select.select-trxs-types').select2({ dropdownParent: '#modal-global' })
    $('select.select-trxs-asset').select2({ dropdownParent: '#modal-global' })

    $('.datepicker').datepicker({
      defaultDate: new Date(),
      setDefaultDate: true,
      format: 'dd/mm/yyyy',
      i18n: PickerUtils.getDatePickerDefault18nStrings(),
    })

    $('#add_trx_btn').click(() => {
      if (addTransactionBtnClickCallback) {
        const date = DateUtils.convertDateToUnixTimestamp($('.datepicker').val())
        const units = $('#trx_units').val()
        const amount = $('#trx_amount').val()
        const observations = $('#trx-description').val()
        const type = $('select.select-trxs-types').val()
        const assetId = $('select.select-trxs-asset').val()
        if (ValidationUtils.checkIfFieldsAreFilled([date, units, amount, type, assetId])) {
          addTransactionBtnClickCallback(date, units, amount, type, observations, assetId)
        }
        else {
          DialogUtils.showErrorMessage(Localization.getString('common.fillAllFieldsTryAgain'))
        }
      }
    })
  },
  renderAssetsSelectOption: (asset, defaultAssetId = undefined) => `
    <option value="${asset.asset_id}" ${(defaultAssetId && asset.asset_id === defaultAssetId) ? 'selected' : ''}>${asset.name}</option>
  `,
  showRemoveTrxConfirmationModal: (modalDivId, trxId, assetId, removeTrxCallback) => {
    $('#modal-global').modal('open')
    let txt = `
      <h4>${Localization.getString('investments.deleteTrxModalTitle', { id: trxId })}</h4>
      <div class="row">
          <p>${Localization.getString("investments.deleteTrxModalSubtitle")}</p>
          <b>${Localization.getString("investments.deleteTrxModalAlert")}</b>
  
      </div>
      `

    let actionLinks = `<a  class="modal-close waves-effect waves-green btn-flat enso-blue-bg enso-border white-text">${Localization.getString(
      'common.cancel')}</a>
            <a id="action-remove-asset-btn" class="waves-effect waves-red btn-flat enso-salmon-bg enso-border white-text">${Localization.getString(
      'common.delete')}</a>`
    $('#modal-global .modal-content').html(txt)
    $('#modal-global .modal-footer').html(actionLinks)
    $('#action-remove-asset-btn').click(() => removeTrxCallback(trxId, assetId))
  },
  showEditTransactionModal: (
    modalDivID, assetsList, trxId, date_timestamp, trxType, totalPrice, name, assetType, ticker, broker, units, observations, assetId,
    editAssetCallback) => {
    $(modalDivID).modal('open')
    let html = `
                <div class="row row-no-margin-bottom">
                    <div class="input-field col s8">
                        <h4>${Localization.getString('investments.editTransaction')}</h4>
                    </div>
                    <div class="input-field col s4">
                        <span class="select2-top-label">${Localization.getString('investments.typeOfTransaction')}</span>
                        <select class="select-trxs-types" name="types">
                            <option ${trxType === MYFIN.INVEST_TRX_TYPES.BUY.id
      ? ' selected '
      : ''} value="${MYFIN.INVEST_TRX_TYPES.BUY.id}">${MYFIN.INVEST_TRX_TYPES.BUY.name}</option>
                            <option ${trxType === MYFIN.INVEST_TRX_TYPES.SELL.id
      ? ' selected '
      : ''} value="${MYFIN.INVEST_TRX_TYPES.SELL.id}">${MYFIN.INVEST_TRX_TYPES.SELL.name}</option>
                        </select>
                    </div>
                </div>
                
                    <form class="col s12">
                        <div class="row row-no-margin-bottom">
                            <div class="input-field col s2">
                                <i class="material-icons prefix">euro_symbol</i>
                                <input id="trx_amount" type="number" step=".01" class="validate" value="${totalPrice}">
                                <label class="active" for="trx_amount">${Localization.getString('common.value')} (€)</label>
                            </div>
                            <div class="input-field col s2">
                                <i class="material-icons prefix">fiber_smart_record</i>
                                <input id="trx_units" type="number" step=".0001" class="validate" value="${units}">
                                <label class="active" for="trx_units">${Localization.getString('investments.units')}</label>
                            </div>  
                             <div class="input-field col s3">
                                <i class="material-icons prefix">date_range</i>
                                <input id="trx_date" type="text" class="datepicker input-field">
                                <label class="active" for="trx_date">${Localization.getString('transactions.dateOfTransaction')}</label>
                            </div>               
                            <div class="input-field col s3 offset-s2">
                            <span class="select2-top-label">${Localization.getString('investments.associatedAsset')}</span>
                                <select class="select-trxs-asset" name="assets" style="width: 100%;">
                                    ${assetsList.map(asset => InvestTransactionsModalFunc.renderAssetsSelectOption(asset, assetId)).join('')}
                                </select>   
                            </div>
                        </div>
                        <div class="row row-no-margin-bottom col s12">                     
                            <div class="col s12">
                                <div class="input-field col s12">
                                    <i class="material-icons prefix">description</i>
                                    <textarea id="trx-description" class="materialize-textarea"></textarea>
                                    <label class="active" for="trx-description">${Localization.getString('investments.observations')}</label>
                                </div>
                            </div> 
                        </div>                             
                    </form>
                </div>
                `

    let actionLinks = `<a  class="modal-close waves-effect waves-green btn-flat enso-blue-bg enso-border white-text">${Localization.getString('common.cancel')}</a>
    <a id="edit_asset_btn"  class="waves-effect waves-red btn-flat enso-salmon-bg enso-border white-text">${Localization.getString('common.edit')}</a>`
    $(`${modalDivID} .modal-content`).html(html)
    $(`${modalDivID} .modal-footer`).html(actionLinks)

    $('#asset_type_select').formSelect()

    $('.datepicker').datepicker({
      defaultDate: new Date(DateUtils.convertUnixTimestampToDateFormat(date_timestamp)),
      setDefaultDate: true,
      format: 'dd/mm/yyyy',
      i18n: PickerUtils.getDatePickerDefault18nStrings(),
    })

    $('select.select-trxs-types').select2({ dropdownParent: '#modal-global' })
    $('select.select-trxs-asset').select2({ dropdownParent: '#modal-global' })

    $('textarea#trx-description').val(observations)

    $('#edit_asset_btn').click(() => {
      if (editAssetCallback) {
        const date_timestamp = DateUtils.convertDateToUnixTimestamp($('.datepicker').val())
        const note = $('#trx-description').val()
        const totalPrice = $('#trx_amount').val()
        const units = $('#trx_units').val()
        const assetId = $('select.select-trxs-asset').val()
        const type = $('select.select-trxs-types').val()

        /*
        if (ValidationUtils.checkIfFieldsAreFilled([date, units, amount, type, assetId])) {*/

        if (ValidationUtils.checkIfFieldsAreFilled([date_timestamp, units, totalPrice, type, assetId])) {
          editAssetCallback(trxId, date_timestamp, note, totalPrice, units, assetId, type)
        }
        else {
          DialogUtils.showErrorMessage(Localization.getString('common.fillAllFieldsTryAgain'))
        }
      }
    })
  },
}

//# sourceURL=js/funcs/investTransactionsModalFunc.js