import styled from "styled-components";

const AboutContainer = styled.div`
  padding: 20px;
  height: calc(100% - 30px);
  overflow-y: auto;
  line-height: 1.6;
`;

const Title = styled.h1`
  color: #0078d7;
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
`;

const List = styled.ul`
  margin: 10px 0;
  padding-left: 20px;
`;

const ListItem = styled.li`
  margin-bottom: 8px;
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
`;

const Copyright = styled.div`
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #ccc;
  font-size: 14px;
  color: #666;
`;

export default function AboutSystem() {
  return (
    <AboutContainer>
      <Title>О системе NEWindows</Title>
      
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

      <Section>
        <SectionTitle>Технологии</SectionTitle>
        <List>
          <ListItem>React</ListItem>
          <ListItem>Styled Components</ListItem>
          <ListItem>BrowserFS</ListItem>
          <ListItem>React Draggable</ListItem>
          <ListItem>Re-resizable</ListItem>
          <ListItem>Font Awesome</ListItem>
        </List>
      </Section>

      <Copyright>
        <p>NEWindows - веб-операционная система, созданная в образовательных целях.</p>
        <p>Все права на использованные материалы принадлежат их respective владельцам.</p>
        <p>Microsoft, Windows, Segoe UI являются зарегистрированными товарными знаками корпорации Microsoft.</p>
      </Copyright>
    </AboutContainer>
  );
}