import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link, useNavigate } from 'react-router-dom'
import { FcGoogle } from 'react-icons/fc'
import { RxCross2 } from 'react-icons/rx'
import { useRef } from 'react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { supabase } from '@/services/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'

export function LoginForm({ className, ...props }) {
  const [showPassword, setShowPassword] = useState(false)

  const { setIsLoggedIn } = useAuth()

  const toastIdRef = useRef(null)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async ({ email, password }) => {
    toastIdRef.current = toast.loading('Logging in...')
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      toast.error(error.message, { id: toastIdRef.current })
      toastIdRef.current = null
      return
    }
    setIsLoggedIn(true)
    toast.success('Login Successful', {
      id: toastIdRef.current,
      onAutoClose: () => {
        toastIdRef.current = null
      },
    })
    navigate('/dashboard')
  }

  return (
    <div className={cn('flex flex-col gap-4', className)} {...props}>
      <Card className="relative">
        <RxCross2
          className="absolute top-4 right-4 cursor-pointer text-xl"
          onClick={() => navigate('/')}
        />
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register('email', { required: true })}
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm">
                      Email is required
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline hover:text-destructive"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', { required: true })}
                    />
                    {errors.password && (
                      <p className="text-destructive text-sm">
                        Password is required
                      </p>
                    )}
                    <Button
                      type="button"
                      size="icon"
                      variant="link"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full">
                  <FcGoogle /> Login with Google
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link to="/signup" className="underline underline-offset-4">
                  Signup
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
