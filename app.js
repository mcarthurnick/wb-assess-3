import express from 'express';
import session from 'express-session';
import lodash from 'lodash';
import morgan from 'morgan';
import nunjucks from 'nunjucks';
import ViteExpress from 'vite-express';

const app = express();
const port = '8000';

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: false }));

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

const MOST_LIKED_FOSSILS = {
  aust: {
    img: '/img/australopith.png',
    name: 'Australopithecus',
    num_likes: 584,
  },
  quetz: {
    img: '/img/quetzal_torso.png',
    name: 'Quetzal',
    num_likes: 587,
  },
  steg: {
    img: '/img/stego_skull.png',
    name: 'Stegosaurus',
    num_likes: 598,
  },
  trex: {
    img: '/img/trex_skull.png',
    name: 'Tyrannosaurus Rex',
    num_likes: 601,
  },
};

const OTHER_FOSSILS = [
  {
    img: '/img/ammonite.png',
    name: 'Ammonite',
  },
  {
    img: '/img/mammoth_skull.png',
    name: 'Mammoth',
  },
  {
    img: '/img/ophthalmo_skull.png',
    name: 'Opthalmosaurus',
  },
  {
    img: '/img/tricera_skull.png',
    name: 'Triceratops',
  },
];

app.get('/', (req, res) => {
  let username = req.session.name
  if(!req.session.name){
    res.render('homepage.html.njk', {
      name: username,
    })
  } else {
    res.redirect('/top-fossils')
  }
})

app.get('/get-name', (req, res) => {
  console.log('req.query.name', req.query.name)
  req.session.name = req.query.name;
  if(req.session.name){
    res.redirect('/top-fossils')
  } else {
    res.send('Please login to continue')
  }
})

app.get('/top-fossils', (req, res) => {
  let fossils = []
  let name = req.session.name;
  if(!name){
    res.redirect('/')
  } else {
    for(let key in MOST_LIKED_FOSSILS){
      MOST_LIKED_FOSSILS[key].ID = key
      fossils.push(MOST_LIKED_FOSSILS[key])
    }
    res.render('top-fossils.html.njk', {
      fossils : fossils,
      name: name
    })
  }
  
})

app.post('/like-fossil', (req, res) => {
  let fossil = "";
  fossil = req.body.fossil
  MOST_LIKED_FOSSILS[fossil].num_likes += 1;

  res.render('thank-you.html.njk', {
    name : req.session.name
  })
})

app.get('/random-fossil.json', (req, res) => {
  const randomFossil = lodash.sample(OTHER_FOSSILS);
  res.json(randomFossil);
});

ViteExpress.listen(app, port, () => {
  console.log(`Server running on http://localhost:${port}...`);
});
