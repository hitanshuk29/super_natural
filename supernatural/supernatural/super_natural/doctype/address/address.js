// Copyright (c) 2025, Farhan and contributors
// For license information, please see license.txt


frappe.ui.form.on('Address', {
    refresh: function (frm) {
        // Update address_line1 when form is refreshed
        frm.trigger('update_address_line1');
    },
    custom_area_n: function (frm) {
        frm.trigger('update_address_line1');
    },
    block: function (frm) {
        frm.trigger('update_address_line1');
    },
    street: function (frm) {
        frm.trigger('update_address_line1');
    },
    building: function (frm) {
        frm.trigger('update_address_line1');
    },
    floor: function (frm) {
        frm.trigger('update_address_line1');
    },
    apartment: function (frm) {
        frm.trigger('update_address_line1');
    },
    update_address_line1: function (frm) {
        const { custom_area_n, block, street, building, floor, apartment } = frm.doc;

        // Construct the address line from the fields
        const address_parts = [
            custom_area_n ? `منطقة: ${custom_area_n}` : null, 
            block? `قطعة:${block}` : null,
            street? `شارع:${street}` : null,
            building? `مبنى: ${building}` : null,
            floor ? `طابق : ${floor}` : null,
            apartment ? `شقة: ${apartment}` : null,
        ].filter(Boolean); // Remove empty or null values

        frm.set_value('address_line1', address_parts.join(', '));
    }
});
