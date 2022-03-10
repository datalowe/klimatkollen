import { GetServerSideProps } from 'next'
import { useState } from 'react'
import styled from 'styled-components'
import DropDown from '../components/DropDown'
import Map from '../components/Map'
import MetaTags from '../components/MetaTags'
import { H1, ParagraphBold, Paragraph } from '../components/Typography'
import { EmissionService } from '../utils/emissionService'
import { Municipality } from '../utils/types'
import PageWrapper from '../components/PageWrapper'
import Icon from '../public/icons/arrow.svg'

type PropsType = {
  municipalities: Array<Municipality>
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap 3rem;
`

const Square = styled.div<{ color: string }>`
  background-color: ${(props) => props.color};
  width: 20px;
  height: 20px;
  position: relative;
`

const ArrowIcon = styled(Icon)<{ rotateUp?: boolean }>`
  position: absolute;
  z-index: 1;
  margin: auto;
  left: 0;
  ${(props) => props.rotateUp && 'transform: rotate(-90deg)'};
  right: 0;
  top: 0;
  bottom: 0;
`

const InfoBox = styled.div`
  padding-left: 0.87rem;
  padding-top: 1.2rem;
`

const Label = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:first-child div {
    border-radius: 10% 10% 0 0;
  }
  &:last-child div {
    border-radius: 0 0 10% 10%;
  }
`
const LastLabel = styled(Label)`
    margin-top:5px;
`
const FlexCenter = styled.div`
  width: 100%;
  display: flex;
`

const StyledParagraph = styled(Paragraph)`
  z-index: 1;
`

const Home: React.FC<PropsType> = ({ municipalities }: PropsType) => {
  const [selected, setSelected] = useState('Utforska kartan')
  const municipalitiesName = municipalities.map((item) => item.Name)
  const emissionsLevels = municipalities.map((item) => ({
    name: item.Name,
    emissions: item.HistoricalEmission.EmissionLevelChangeAverage,
  }))

  return (
    <>
      <MetaTags
        title="Klimatkollen — Enkel fakta om klimatomställningen"
        description="Hur går det med utsläppsminskningarna i Sverige och i din kommun? Minskar eller ökar klimatutsläppen? Klarar vi Parisavtalet?"
      />
      <PageWrapper backgroundColor="black">
        <Container>
          <div>
            <H1>Klimatkollen</H1>
            <Paragraph>Enkel fakta om klimatomställningen</Paragraph>
          </div>
          <FlexCenter>
            <DropDown municipalitiesName={municipalitiesName} />
          </FlexCenter>
          <FlexCenter>
            <div>
              <ParagraphBold>Utsläppsförändring sedan Parisavtalet 2015</ParagraphBold>
              <p>För att nå målet behöver klimatutsläppen minska med X% per år,</p>
            </div>
          </FlexCenter>
          <div>{setSelected}</div>
          <Map emissionsLevels={emissionsLevels} setSelected={setSelected}>
            <InfoBox>
              <Label>
                <Square color="#EF3054">
                  <ArrowIcon rotateUp={true} />
                </Square>
                <StyledParagraph>0% +</StyledParagraph>
              </Label>
              <Label>
                <Square color="#EF5E30">
                  <ArrowIcon />
                </Square>
                <StyledParagraph>0-1%</StyledParagraph>
              </Label>
              <Label>
                <Square color="#EF7F17">
                  <ArrowIcon />
                </Square>
                <StyledParagraph>1-2%</StyledParagraph>
              </Label>
              <Label>
                <Square color="#EF9917">
                  <ArrowIcon />
                </Square>
                <StyledParagraph>2-3%</StyledParagraph>
              </Label>
              <Label>
                <Square color="#EFBF17">
                  <ArrowIcon />
                </Square>
                <StyledParagraph>3-10%</StyledParagraph>
              </Label>
              <Label>
                <Square color="#91BFC8">
                  <ArrowIcon />
                </Square>
                <StyledParagraph>10%-15%</StyledParagraph>
              </Label>
              <LastLabel>
                <Square color="#4ECB80"></Square>
                <StyledParagraph>Parisavtalet</StyledParagraph>
              </LastLabel>
            </InfoBox>
          </Map>
        </Container>
      </PageWrapper>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const municipalities = await new EmissionService().getMunicipalities()
  if (municipalities.length < 1) throw new Error('No municipalities found')

  res.setHeader('Cache-Control', 'public, maxage=3600, s-maxage=4000')

  return {
    props: { municipalities },
  }
}

export default Home
