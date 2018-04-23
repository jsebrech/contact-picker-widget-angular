import { ContactPickerValue } from './contact-picker.value';

/**
 * The auto-complete component does not support duplicate labels,
 * this function ensures every name in a list of value objects is unique.
 * @param items The list of value objects to make unique
 * @returns A copy of the list with the name property made unique.
 */
export default function withUniqueNames(items: ContactPickerValue[]): ContactPickerValue[] {
    const counts = {};
    return items.map((item) => {
        let result = item;
        if (!counts[item.name]) {
            counts[item.name] = 0;
        }
        if (++counts[item.name] > 1) {
            result = Object.assign({}, item, {
                name: item.name + ' (' + (item.userName || counts[item.name]) + ')'
            });
        }
        return result;
    });
}
