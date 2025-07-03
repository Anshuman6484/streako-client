import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import { ThemeToggle } from './ui/ThemeToggle.jsx'
import { MdMenu } from 'react-icons/md'
import { Button } from './ui/button.jsx'
import { supabase } from '@/services/supabaseClient.js'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext.jsx'
// import { useRef, useState } from 'react'
// import Ham from './Ham'
// import AuthButton from './AuthButton'

function Navbar() {
  //   const [open, setOpen] = useState(false)
  //   const hamRef = useRef(null)

  const { isLoggedIn, setIsLoggedIn } = useAuth()

  const navigate = useNavigate()

  const logout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      toast.error('Logout failed: ' + error.message)
    } else {
      toast.success('Logged out successfully')
      setIsLoggedIn(false)
      navigate('/') // Redirect to home/login page
    }
  }

  return (
    <>
      <nav className="fixed w-full px-4 py-2 border-b border-border bg-background">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            STREAKO
          </Link>

          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="gap-4">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavLink to="/about">About</NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavLink to="/contact">Contact</NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <ThemeToggle className="hidden md:flex" />

          {/* <div className="hidden md:flex">
            <AuthButton />
          </div> */}
          <div className="hidden md:flex">
            {isLoggedIn ? (
              <Button onClick={logout}>Log Out</Button>
            ) : (
              <Button onClick={() => navigate('/login')}>Log In</Button>
            )}
          </div>
          {/* Mobile */}
          {/* <div
            className="md:hidden cursor-pointer"
            onClick={() => setOpen(!open)}
            ref={hamRef}
          >
            <MdMenu className="text-4xl" />
          </div> */}
        </div>
      </nav>
      {/* Mobile Menu Section */}
      {/* <Ham open={open} setOpen={setOpen} hamRef={hamRef} /> */}
    </>
  )
}

export default Navbar
