import {IState} from "../App";

export const VAT = 13;

export const salaryTypes = [
    { name: 'Оклад за месяц', value: '1' },
    { name: 'МРОТ', value: '2' },
    { name: 'Оплата за день', value: '3' },
    { name: 'Оплата за час', value: '4' }
];

export const getTotalSum = ({ salaryType, sum, withoutVat }: Pick<IState, 'salaryType' | 'withoutVat' | 'sum'>): Pick<IState, 'onHand' | 'total' | 'vat'> => {
    if (salaryType !== '1') return { onHand: 0, total: 0, vat: 0 };
    if (!withoutVat) {
        const onHand = Math.round(sum - (sum * VAT / 100));
        const total = sum;
        const vat = Math.round(total - onHand);

        return { onHand, vat, total }
    }

    if (withoutVat) {
        const onHand = sum;
        const total = Math.round((sum / (100 - VAT)) * 100);
        const vat = Math.round(total - sum);

        return { onHand, vat, total }
    }
};
