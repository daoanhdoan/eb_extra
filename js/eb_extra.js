(function ($, Drupal, drupalSettings) {
  'use strict'
  Drupal.behaviors.ebExtraSelect = {
    attach: function () {
      $('.eb-extra-select').change(function () {
        var entity_ids = [];
        var $this = $(this), entity_type = $this.attr('data-entity-type-id'), val = $this.val();
        if (typeof val == "object") {
          $.each(val, function (index, item) {
            if (item.toString() !== "_none") {
              entity_ids[index] = entity_type + ":" + item;
            }
          });
        } else if (val !== "_none") {
          entity_ids[0] = entity_type + ":" + val
        }
        $this.parents('div.eb-extra-wrapper').find('input[type*=hidden][name*="[target_id]"]').val(entity_ids.join(' ')).trigger('entity_browser_value_updated');
      });
    }
  };
  Drupal.ebExtra = Drupal.ebExtra || {};
  /**
   * Reacts on "entities selected" event.
   *
   * @param {object} event
   *   Event object.
   * @param {string} uuid
   *   Entity browser UUID.
   * @param {array} entities
   *   Array of selected entities.
   */
  Drupal.ebExtra.selectionCompleted = function (event, uuid, entities) {
    var selected_entities = $.map(entities, function (item) {
      return item[2] + ':' + item[0];
    });
    // @todo Use uuid here. But for this to work we need to move eb uuid
    // generation from display to eb directly. When we do this, we can change
    // \Drupal\entity_browser\Plugin\Field\FieldWidget\EntityReferenceBrowserWidget::formElement
    // also.
    // Checking if cardinality is set - assume unlimited.
    var cardinality = isNaN(parseInt(drupalSettings['entity_browser'][uuid]['cardinality'])) ? -1 : parseInt(drupalSettings['entity_browser'][uuid]['cardinality']);

    // Get field widget selection mode.
    var selection_mode = drupalSettings['entity_browser'][uuid]['selection_mode'];

    // Update value form element with new entity IDs.
    var selector = drupalSettings['entity_browser'][uuid]['selector'] ? $(drupalSettings['entity_browser'][uuid]['selector']) : $(this).parent().parent().find('input[type*=hidden]');
    var entity_ids = selector.val();
    var existing_entities = (entity_ids.length !== 0) ? entity_ids.split(' ') : [];

    entity_ids = Drupal.entityBrowser.updateEntityIds(
      existing_entities,
      selected_entities,
      selection_mode,
      cardinality
    );

    selector.val(entity_ids);
    selector.parent('.eb-extra-wrapper').find('select.eb-extra-select').val($.map(entity_ids.split(' '), function (item) {
      return item.match(/\d+$/)[0];
    }));
    selector.trigger('entity_browser_value_updated');
  };
})(jQuery, Drupal, drupalSettings);

/*(function (drupalSettings) {
  var ebmi = jQuery('.entity-browser-modal-iframe');
  if (ebmi.length) {
    var pJQ = parent.jQuery, ifr = pJQ(parent.document).find('.entity-browser-modal-iframe');
    if (ifr.length) {
      var cls = pJQ(ifr).parents('.ui-dialog').eq(0).find('.ui-dialog-titlebar-close'),
        btc = pJQ('<button>', {class: "ui-dialog-titlebar-close-eb-extra"}).html('Close');
      pJQ(ifr).parents('.ui-dialog').eq(0).find('.ui-dialog-titlebar').prepend(btc);

      if (cls.length) {
        pJQ(btc).click(function (event) {
          var selected = ifr.contents().find('.entity-browser-use-selected');
          if (selected.length) {
            selected.click();
          } else {
            cls.click();
          }
          event.preventDefault();
        });
      }
    }
  }
}(drupalSettings));*/

