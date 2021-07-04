import emailjs from 'emailjs-com'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const send_email = (to_email, from_email, to_name, from_name, user_message) => {
    emailjs.send('service_hcuy8vf', 'template_xwaaou7',
        {
            geter_email: to_email,
            sender_email: from_email,
            geter_name: to_name,
            sender_name: from_name,
            message: user_message,
        },
        'user_AaGFS42vLs9WBvfOsk5c3');
}
const show_message = (message) => toast.dark(message);
const show_error_message = (message) => toast.error(message);
const show_warn_message = (message) => toast.warn(message);
const show_light_message = (message) => toast(message);


const toastContainer = () => {
    return (
        <ToastContainer
            position="bottom-right"
            hideProgressBar
            newestOnTop={false}
        />
    );
}

function formatDate() {
    let date = new Date(),
        month = "" + (date.getMonth() + 1),
        day = "" + date.getDate(),
        year = date.getFullYear();
    if (month.length < 2) {
        month = "0" + month;
    }
    if (day.length < 2) {
        day = "0" + day;
    }
    return [day, month, year].join("/");
}






export { send_email, toastContainer, show_message, show_error_message, show_warn_message, show_light_message ,formatDate }