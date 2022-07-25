import React from 'react';

const Payment = (username, phone, email ,pay) => {
    const onClickPayment = () => {
        const { IMP } = window;
        IMP.init('imp62845076');

        const data = {
            pg: 'html5_inicis',
            pay_method: 'vbank',
            merchant_uid: `mid_${new Date().getTime()}`,
            name: '포인트 충전',
            amount: pay,
            custom_data: {
                name: '부가정보',
                desc: '세부 부가정보',
            },
            buyer_name: username,
            buyer_tel: phone,
            buyer_email: email,
            buyer_addr: '구천면로 000-00',
            buyer_postalcode: '01234',
        };

        IMP.request_pay(data, callback);
    };

    const callback = response => {
        const { success, error_msg, imp_uid, merchant_uid, pay_method, paid_amount, status } = response;

        if (success) {
            alert('결제 성공');
        } else {
            alert(`결제 실패: ${error_msg}`);
        }
    };

    return <>{onClickPayment()};</>;
};
export default Payment;