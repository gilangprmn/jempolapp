const ResetToken = require('./resetToken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

app.post('/request-reset-password', async (req, res) => {
  const { email } = req.body;
  const user = await collection.findOne({ email });
  
  if (!user) {
    return res.send('User not found');
  }

  const token = crypto.randomBytes(32).toString('hex');
  const resetToken = new ResetToken({ email, token });
  await resetToken.save();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Reset Password',
    text: `Klik link ini untuk reset password Anda: http://localhost:8082/reset-password?token=${token}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.send('Error sending email: ' + error.message);
    }
    res.send('Password reset link sent');
  });
});

app.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    const resetToken = await ResetToken.findOne({ token });
  
    if (!resetToken) {
      return res.send('Invalid or expired token');
    }
  
    const user = await collection.findOne({ email: resetToken.email });
    if (!user) {
      return res.send('User not found');
    }
  
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await resetToken.delete();
  
    res.send('Password has been reset');
  });
  