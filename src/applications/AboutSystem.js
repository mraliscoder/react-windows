import styled from "styled-components";

const AboutContainer = styled.div`
  padding: 0;
  height: calc(100% - 30px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', sans-serif;
`;

const Header = styled.div`
  background: linear-gradient(135deg, #0078d7 0%, #106ebe 100%);
  color: white;
  padding: 30px 20px;
  text-align: center;
`;

const WindowsLogo = styled.div`
  font-size: 48px;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 300;
`;

const Subtitle = styled.div`
  font-size: 14px;
  opacity: 0.9;
  margin-top: 5px;
`;

const Content = styled.div`
  padding: 20px;
  flex: 1;
  overflow-y: auto;
  background: #fff;
`;

const Section = styled.div`
  margin-bottom: 25px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
  font-weight: 600;
`;

const List = styled.ul`
  margin: 10px 0;
  padding-left: 20px;
`;

const ListItem = styled.li`
  margin-bottom: 8px;
  line-height: 1.5;
`;

const Link = styled.a`
  color: #0078d7;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const GitHubLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-weight: 500;
  font-size: 14px;
`;

const Copyright = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  font-size: 12px;
  color: #666;
  line-height: 1.5;
`;

const DeviceSpecs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 15px;
`;

const SpecItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const SpecLabel = styled.span`
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
`;

const SpecValue = styled.span`
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;

const ActivationStatus = styled.div`
  background: #f8f8f8;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const ActivationText = styled.div`
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
`;

const ActivationButton = styled.button`
  background: #0078d7;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 13px;
  
  &:hover {
    background: #106ebe;
  }
`;

export default function AboutSystem() {
  return (
    <AboutContainer>
      <Header>
        <WindowsLogo>
          <i className="fab fa-windows"></i>
        </WindowsLogo>
        <Title>NEWindows</Title>
        <Subtitle>Веб-операционная система</Subtitle>
      </Header>
      
      <Content>
        <ActivationStatus>
          <ActivationText>Активация NEWindows</ActivationText>
          <div style={{fontSize: '13px', color: '#107c10', marginBottom: '8px'}}>
            ✓ NEWindows активирована
          </div>
          <ActivationButton>Изменить ключ продукта</ActivationButton>
        </ActivationStatus>

        <Section>
          <SectionTitle>Характеристики устройства</SectionTitle>
          <DeviceSpecs>
            <SpecItem>
              <SpecLabel>Процессор</SpecLabel>
              <SpecValue>Ant Tomato 4 Pro 1700X 3.80GHz</SpecValue>
            </SpecItem>
            <SpecItem>
              <SpecLabel>ОЗУ</SpecLabel>
              <SpecValue>16 GigaMeowByte</SpecValue>
            </SpecItem>
            <SpecItem>
              <SpecLabel>Тип системы</SpecLabel>
              <SpecValue>64-разрядная Web-ОС</SpecValue>
            </SpecItem>
            <SpecItem>
              <SpecLabel>Выпуск</SpecLabel>
              <SpecValue>NEWindows Pro</SpecValue>
            </SpecItem>
          </DeviceSpecs>
        </Section>

        <Section>
          <SectionTitle>Разработчики</SectionTitle>
          <List>
            <ListItem>
              <Link href="https://github.com/mraliscoder" target="_blank" rel="noopener noreferrer">
                Eduard Ilin (mraliscoder)
              </Link>
            </ListItem>
            <ListItem>
              <Link href="https://github.com/TheDayG0ne" target="_blank" rel="noopener noreferrer">
                Evgeniy Struchkov (TheDayG0ne)
              </Link>
            </ListItem>
          </List>
        </Section>

        <Section>
          <SectionTitle>Проект на GitHub</SectionTitle>
          <GitHubLink href="https://github.com/mraliscoder/react-windows" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github"></i>
            https://github.com/mraliscoder/react-windows
          </GitHubLink>
        </Section>

        <Section>
          <SectionTitle>Использованные ресурсы</SectionTitle>
          <List>
            <ListItem>Дизайн и интерфейс: Вдохновлен Windows 10 (Microsoft Corporation)</ListItem>
            <ListItem>Иконки: Windows 10 Icons (Microsoft Corporation)</ListItem>
            <ListItem>Шрифт: Segoe UI (Microsoft Corporation)</ListItem>
            <ListItem>Обои: Windows 10 Default Wallpaper (Microsoft Corporation)</ListItem>
          </List>
        </Section>

        <Copyright>
          <p>NEWindows - веб-операционная система, созданная в образовательных целях.</p>
          <p>Все права на использованные материалы принадлежат их соответствующим владельцам.</p>
          <p>Microsoft, Windows, Segoe UI являются зарегистрированными товарными знаками корпорации Microsoft.</p>
          <p style={{marginTop: '10px'}}>© 2024-2025 NEWindows. Все права защищены.</p>
        </Copyright>
      </Content>
    </AboutContainer>
  );
}