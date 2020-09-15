import express, { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import User, { IUserModel } from './models/User'
import { NativeError } from 'mongoose'

function ensureAuthenticated (req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated()) {
    next()
  } else {
    req.flash('info', 'You must be logged in to see this page.')
    res.redirect('/login')
  }
}

const router = express.Router()

router.use(function (req: Request, res: Response, next) {
  res.locals.currentUser = req.user
  res.locals.errors = req.flash('error')
  res.locals.infos = req.flash('info')
  next()
})

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  await User.find()
    .sort({ createdAt: 'descending' })
    .exec((err: NativeError, users: IUserModel) => {
      if (err != null) {
        return next()
      }
      res.render('index', { users })
    })
})

router.get('/signup', (req: Request, res: Response) => {
  res.render('singup')
})

router.post(
  '/signup',
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body
    await User.findOne(
      { username: username },
      (err: NativeError, user: IUserModel) => {
        if (err != null) {
          return next(err)
        }
        if (user != null) {
          req.flash('error', 'User already exists')
          return res.redirect('/signup')
        }
        const newUser = new User({ username, password })
        // eslint-disable-next-line no-void
        void newUser.save(next)
      }
    )
  },
  passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  })
)

router.get('/logout', (req: Request, res: Response) => {
  req.logout()
  res.redirect('/')
})

router.get('/login', (req: Request, res: Response) => {
  res.render('login')
})

router.post('/login', passport.authenticate(
  'login',
  {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })
)

router.get('/users/:username',
  async (req: Request, res: Response, next: NextFunction) => {
    await User.findOne({
      username: req.params.username
    }, (err: Error, user: IUserModel) => {
      if (err !== null) {
        return next(err)
      }
      if (user === null) {
        return next(404)
      }
      res.render('profile', { user })
    }
    )
  }
)

router.get('/edit', ensureAuthenticated, (req: Request, res: Response) => {
  res.render('edit')
})

router.post('/edit', (req: Request, res: Response, next: NextFunction) => {
  const user: IUserModel = (req.user as IUserModel)
  user.displayName = req.body.displayName
  user.bio = req.body.bio
  user.save().then(() => {
    req.flash('info', 'Profile updated!')
    res.redirect('/edit')
  }).catch((error) => {
    next(error)
  })
})

export default router
