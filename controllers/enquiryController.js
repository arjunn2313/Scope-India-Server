const enquiryModel = require("../model/enquirySchema");

const enquiry = async (req, res) => {
  try {
    let { fullName, email, subject, message } = req.body;
    const enquiry = new enquiryModel(req.body);

    const newEnquiry = await enquiry.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email,
        pass: process.env.epas,
      },
    });

    const mailOptions = {
      from: "testingweb262@gmail.com",
      to: "arjunnks123@gmail.com",
      subject: "Enquiry",
      html: `<h1>Enquiry</h1><br/>
                Name : ${fullName}<br/>
                Email : ${email}<br/>
                subject : ${subject}<br/>
                message : ${message}<br/>
            `,
    };

    try {
      const sentMailInfo = await transporter.sendMail(mailOptions);
      console.log("email sent", sentMailInfo.response);

      res.status(200).json({
        status: true,
        message:
          "Enquiry message has been sent successfully our carrer expert will get touch with you soon",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({
        status: false,
        message: "Error sending email",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = enquiry;
