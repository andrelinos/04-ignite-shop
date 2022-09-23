import Image from 'next/future/image';
import logoImage from '~/assets/logo.svg';
import { ContainerHeader } from './styles';

export function Header() {
  return (
    <ContainerHeader>
      <Image src={logoImage} alt="logo" />
    </ContainerHeader>
  );
}
