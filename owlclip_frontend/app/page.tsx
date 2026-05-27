import {checkUserToken} from '@/src/features/auth/auth-guard';
import HomeContent from '@/src/components/home/HomeContent';


export default async function Home(){
  const token = await checkUserToken();

  return <HomeContent token={token ?? ''}/>
}