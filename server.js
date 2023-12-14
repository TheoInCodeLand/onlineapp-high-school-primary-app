const express = require('express');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3000;
const ejs = require('ejs');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: 'gfgh435',
    resave: false,
    saveUninitialized: true,
  })
);


const isAdmin = (req, res, next) => {
    const user = req.session.user;

    if (user && user.isAdmin) {
        next();
    } else {
        res.redirect('/signin'); 
    }
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'botauto212@gmail.com',
      pass: 'cjeifgsiqfivevdx',
  },
});

app.use('/adminDashboard', isAdmin);


const users = [
    { name: 'Admin', id: 'admin', email: 'admin@example.com', password: 'adminPassword', isAdmin: true },
];
const applications = [];

const schools = [
  { name: 'Smithtown High School', enrolledStudents: 0, pendingApplications: 0 },
  { name: 'Maplewood Academy', enrolledStudents: 0, pendingApplications: 0 },
  { name: 'Riverside Junior High', enrolledStudents: 0, pendingApplications: 0 },
  { name: 'Greenwood Elementary School', enrolledStudents: 0, pendingApplications: 0 },
  { name: 'Pineview Middle School', enrolledStudents: 0, pendingApplications: 0 }
];

const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/signin');
  } else {
    next();
  }
};


app.get('/schools', (req, res) => {
  res.render('schools', { schools });
});


app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', (req, res) => {
  const { name, id, email, pass1 } = req.body;
  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    res.render('signup', { error: 'User with the same email already exists' });
  } else {
    users.push({ name, id, email, password: pass1 });
    res.redirect('/signin');
  }
});


app.get('/signin', (req, res) => {
  res.render('login');
});

app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
   
        req.session.user = user;
        
        if (user.isAdmin) {
            res.redirect('/adminDashboard');
        } else {
            res.redirect('/userDashboard');
        }
    } else {
        res.render('login', { error: 'Invalid Credentials' });
    }
});


app.get('/userDashboard', requireLogin, (req, res) => {
  const user = req.session.user;
  res.render('userDashboard', { user });
});

app.post('/apply/:schoolName', requireLogin, (req, res) => {
    const user = req.session.user;
    const schoolName = req.params.schoolName;
    const school = schools.find((s) => s.name === schoolName);
    if (user && school) {
      const existingApplication = applications.find((app) => app.user.email === user.email && app.school.name === school.name);
      if (existingApplication) {
        res.redirect('/schools');
      } else {
        applications.push({ user, school, status: 'Pending' });
        res.redirect('/userDashboard');
      }
    } else {
      res.redirect('/schools');
    }
  });


app.get('/trackApplication', requireLogin, (req, res) => {
    const user = req.session.user;
    if (user) {
      const userApplications = applications.filter((app) => app.user.email === user.email);
      res.render('trackApplication', { userApplications });
    } else {
      res.redirect('/signin');
    }
  });
  
app.get('/adminDashboard', isAdmin, (req, res) => {
    const allApplications = applications; 

    res.render('dashboard', { applications: allApplications });
});

app.post('/updateStatus/:applicationId', (req, res) => {
  const applicationId = req.params.applicationId;
  const newStatus = req.body.newStatus;

  const application = applications.find((app) => app.id === applicationId);
  if (application) {
    application.status = newStatus;
    res.redirect('/adminDashboard');
  } else {
    res.redirect('/adminDashboard');
  }
});

app.get('/', (req, res) => {
  res.render('index');
});


app.get('/forgot-password', (req, res) => {
  res.render('forgotPassword',{error:null});
});

app.get('/guest', (req, res) => {
    res.render('guest', { schools });
  });


  app.get('/guest.html', (req, res) => {
    res.redirect('/guest');
  });

  app.get('/login.html', (req, res) => {
    res.redirect('/signin');
  });


  app.get('/application-form', requireLogin, (req, res) => {
    const user = req.session.user;
    if (user && !user.isAdmin) {
        res.render('applicationForm', { user: user }); 
    } else {
        res.send("you are not logged in") 
    }
});

app.get('/dashboard', (req, res) => {
    res.render('userDashboard', { user: req.user }); 
});

app.post('/submit-application', (req, res) => {
  const { name, email, phone, school, grade } = req.body;
  const user = req.session.user;
  const newApplication = { user: user, name: name, email: email, phone: phone, school: school, grade: grade,status: 'Pending',};
  applications.push(newApplication);
  const targetSchool = schools.find(s => s.name === school);
  if (targetSchool) {targetSchool.pendingApplications++;}
  res.render('applicationConfirmation', { name, school });
});
 

app.get('/submit-application',(req,res)=> res.render("login.ejs"))

app.post('/submit-application', (req, res) => {
    const { name, email, phone, school, grade } = req.body;

    res.render('applicationConfirmation', { name, school });
});

app.get('/signout', (req, res) => {
    
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
        } else {
    
            res.redirect('/');
        }
    });
});

app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  let error = null;

  if (user) {
      // Send an email with the old password
      sendOldPasswordEmail(user.email, user.password);

      res.render('oldPasswordSent', { email });
  } else {
      error = 'Email not found';
      res.render('forgotPassword', { error });
  }
});

function sendOldPasswordEmail(to, oldPassword) {
  // Setup email data
  const mailOptions = {
    from: 'botauto212@gmail.com',
    to: to,
    subject: 'Password Recovery',
    text: `Your old password is: ${oldPassword}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
