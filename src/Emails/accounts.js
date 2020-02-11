const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendwelcomeEmail = (email,name) => {
sgMail.send({
    to:email,
    from:'ranjan2rohit321@gmail.com',
    subject:'WELCOME TO THE APP!!',
    text:`Welcome to the app ${name}. let me know how you get along the app `
})
}

const sendcancelEmail = (email,name) =>{
    sgMail.send({
        to:email,
        from:'ranjan2rohit321@gmail.com',
        subject:'Regarding cancelation of email',
        text:`Hi ${name}, thank u for using the app and we are very sad to hear that you are leaving the app`
    })
}

module.exports={sendwelcomeEmail,sendcancelEmail}