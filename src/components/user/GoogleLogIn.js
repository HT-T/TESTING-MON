import { Button, ButtonGroup, VisuallyHidden } from '@chakra-ui/react';
import { GoogleIcon } from './ProvidersIcon';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

 export default function GoogleLogIn() {
   const { signInWithGoogle } = useAuth();
   let navigate = useNavigate();

   const handleSignIn = async(e) => {
    e.preventDefault();
    await signInWithGoogle();
    navigate("/"); 
   };

   return (
     <ButtonGroup variant="outline" spacing="4" width="full">
       <Button
         type="button"
         key="Google"
         width="full"
         onClick={(e) => handleSignIn(e)}>
         <VisuallyHidden>Sign in with Google</VisuallyHidden>
         <GoogleIcon boxSize="5" />
       </Button>
       
     </ButtonGroup>
   );
 }
