import React from 'react';

const Payment = (effect, deps, pay) => {
    const onClickPayment = () => {
        const { IMP } = window;
        IMP.init('imp62845076');

        const data = {
            pg: 'html5_inicis',
            pay_method: 'card',
            merchant_uid: `mid_${new Date().getTime()}`,
            name: '결제 테스트',
            amount: '1',
            custom_data: {
                name: '부가정보',
                desc: '세부 부가정보',
            },
            buyer_name: '홍길동',
            buyer_tel: '01012345678',
            buyer_email: '14279625@gmail.com',
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