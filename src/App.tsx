import React, {useState} from 'react';
import { connect } from 'react-redux'
import {Field, reduxForm, formValueSelector, WrappedFieldInputProps} from 'redux-form';
import classNames from 'classnames';
import { getTotalSum, salaryTypes } from "./helpers/payroll";
import { InjectedFormProps } from "redux-form";

export interface IState {
    salaryType: string
    withoutVat: boolean
    sum: number
    onHand: number
    vat: number
    total: number
}

export interface ISalaryType {
    input: WrappedFieldInputProps
    salary: {
        name: string
        value: string
    }
    showHint: boolean
    setShowHint: (value: boolean) => void
}

const SalaryType: React.FC<ISalaryType> = ({ input, salary, showHint, setShowHint }) => (
    <>
        <div className="form-check textCheck bold">
            <input
                className="form-check-input"
                type="radio"
                name="exampleRadios"
                id="exampleRadios2"
                value={salary.value}
                checked={input.value === salary.value}
                onChange={(e) => input.onChange(e.target.value)}
            />
            <label className="form-check-label" htmlFor="exampleRadios2">
                { salary.name }
            </label>
            {salary.value === '2' && <>
              <div className={classNames("icon", { info: !showHint, close: showHint })} onClick={() => setShowHint(!showHint)}/>
              <div className={classNames("tooltip", { hint: showHint })} role="tooltip">
                <div className="arrow"></div>
                <div className="tooltip-inner text">
                  МРОТ - минимальный размер оплаты труда. Разный для разных регионов.
                </div>
              </div>
            </>}
        </div>
    </>
);

const Checkbox = ({ input }: { input: WrappedFieldInputProps }) => (
    <>
        <label className="switch">
            <input
                type="checkbox"
                checked={!!input.value}
                onChange={(e) => input.onChange(e.target.checked)}
            />
            <span className="slider round"/>
        </label>
    </>
);

const Input: React.FC<{ input: WrappedFieldInputProps }> = ({ input }) => (
    <>
        <input
            className="sum"
            type="text"
            pattern="[0-9]*"
            value={input.value.toLocaleString()}
            onChange={(e) => input.onChange(parseInt(e.target.value.replace(/\s+/g, '') || '0'))}
        />
    </>
    );


// TODO: need resolve problem with props type
const App: React.FC<InjectedFormProps<IState>> = (props: any) => {
    const [showHint, setShowHint] = useState<boolean>(false);

    return (
    <div className="container">
        <p className="h1">Расчет зарплаты</p>
        <div>
            <span className="bold grey">Сумма</span>
            <div className="check-group">
                {salaryTypes.map((salary) =>
                    <Field key={salary.value} name="salaryType" component={SalaryType} {...{salary, showHint, setShowHint}} />)}
            </div>
            {props.salaryType !== '2' && <div className="salary">
                <div className="text bold">
                    <span className={classNames('bold', { grey: props.withoutVat })}>Указать с НДФЛ</span>
                    <Field name='withoutVat' component={Checkbox}/>
                    <span className={classNames('bold', { grey: !props.withoutVat })}>Без НДФЛ</span>
                </div>
                <div className="text bold">
                    <div>
                        <Field
                            name="sum"
                            component={Input}
                            type="text"
                        />
                      <label className="bold">₽ в день</label>
                    </div>
                </div>
            </div>}
        </div>
        {props.salaryType === '1' && <div className="details textCheck">
            <label><span className="bold">{props.onHand.toLocaleString()} ₽ </span>сотрудник будет получать на руки</label>
            <label><span className="bold">{props.vat.toLocaleString()} ₽ </span>НДФЛ, 13% от оклада</label>
            <label><span className="bold">{props.total.toLocaleString()} ₽ </span>за сотрудника в месяц</label>
        </div>}
    </div>
)};

const DecorateApp = reduxForm<IState, {}>({
    form: 'salaryFormValues',
    initialValues: {
        withoutVat: true,
        salaryType: '1',
        sum: 0,
    }
})(App);

const selector = formValueSelector('salaryFormValues');

export default connect((state: IState) => {
    const salaryType = selector(state, 'salaryType');
    const withoutVat = selector(state, 'withoutVat');
    const sum = selector(state, 'sum');
    const { onHand, vat, total } = getTotalSum({ salaryType, sum, withoutVat });

    return {
        salaryType,
        withoutVat,
        sum,
        onHand,
        vat,
        total
    }
})(DecorateApp);
