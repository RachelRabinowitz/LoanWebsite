
import { PayPalButton } from "react-paypal-button-v2";

import { send_email, toastContainer, show_message } from '../../shared/publicFunctions'


export default function Paypal({ email, clientId, handler }) {

  let message = 'We would like blessing you on your generous donation<br/><br/>כל העוסקים בצרכי ציבור הקבה באמונה ישלם שכרם<br/><br/> Loan fund website'
  return (
    <>
      <PayPalButton
        amount='0.01'
        onSuccess={(details, data) => {
          if (!(email === undefined)) {
            show_message("Transaction completed by " + details.payer.name.given_name);
            send_email(email, 'websiteloanfund@gmail.com', 'Dear donor!', 'Loan fund website', message);
          }
          if (handler !== undefined) {
            handler();
          }
          return fetch("/paypal-transaction-complete", {
            method: "post",
            body: JSON.stringify({
              orderId: data.orderID
            })
          });
        }
        }
        options={{
          clientId: clientId
        }}
      />
      {toastContainer()}
    </>
  );
}