import Wrapper from '../../Providers/Wrapper'

export default function layout({children}: {children : React.ReactNode}) {
  return (
    <>
     <Wrapper>     
      {children}
     </Wrapper>
    </>
  )
}