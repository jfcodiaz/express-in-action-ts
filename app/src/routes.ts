import express, { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import faker from 'faker'
import User, { IUserModel } from './models/User'
import { NativeError } from 'mongoose'

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

router.get('/o', async (req: Request, res: Response) => {
  const user: IUserModel = new User({
    username: faker.internet.email(),
    password: 'Unpa5swOr#',
    createdAt: new Date(),
    displayName: 'El azul',
    bio: 'Bio mamalona'
  })

  await user.save()
  console.log(user.name())
  console.log('password', user.password)
  user.checkPassword('Unpa5swOr#', (_err: Error, result: boolean) => {
    console.log(result)
  })
  user.checkPassword('otropassword', (_err: Error, result: boolean) => {
    console.log(result)
  })
  console.log('password', user.password)
  res.send(`${user.username} inserted`)
})

export default router
