import { useContext } from 'react'
import { RepositoryInfo } from 'components/common/RepositoryInfo'
import { TechnologiesList } from 'components/common/TechnologiesList'
import { Title } from 'components/common/Title'
import { Gallery } from 'components/image-gallery/Gallery'
import { Section, SectionContext } from 'context/SectionContext'
import astroKulkaImg from 'img/games/astro-kulka.webp'
import avoidLines from 'img/games/avoid-lines.webp'
import bertaSnakesImg from 'img/games/berta-snakes.webp'
import kulkaWTarapatach from 'img/games/kulka-w-tarapatach.webp'
import snakeImg from 'img/games/snake.webp'
import tenTacToeImg from 'img/games/ten-tac-toe.webp'
import tetrisImg from 'img/games/tetris.webp'
import zeroGBallImg from 'img/games/zero-g-ball.webp'

import 'common-styles/tooltip.scss'
import 'common-styles/typography.scss'
import 'devicon/devicon.min.css'
import './GameDevelopment.scss'

export const GameDevelopment = () => {
  const { section } = useContext(SectionContext)

  const paused = section !== Section.GAME_DEVELOPMENT

  const delayBase = 200
  const delaySection = 600

  return (
    <div className="game-development-main">
      <Title paused={paused} delay={delayBase}>
        Game development
      </Title>
      <div className="gallery-container">
        <Gallery images={images} />
      </div>
      <Title paused={paused} delay={delayBase + delaySection * 1}>
        Some of technologies used in my game projects
      </Title>
      <TechnologiesList technologies={technologies} />
    </div>
  )
}

const images = [
  {
    src: tenTacToeImg,
    content: (
      <RepositoryInfo link="https://github.com/Aktyn/Ten-tac-toe">
        Easy single-file implementation of the <strong>Ten Tac Toe</strong> game without using any
        web frameworks or a server.
        <br />
        The game uses peer to peer connections to play with other players.
      </RepositoryInfo>
    ),
  },
  {
    src: bertaSnakesImg,
    content: (
      <RepositoryInfo link="https://github.com/Aktyn/BertaSnakes">
        <strong>Berta Snakes</strong> is a multiplayer browser game with a lot of features.
        <br />
        It has WebGL based graphic with custom shaders and a unique physics engine.
      </RepositoryInfo>
    ),
  },
  {
    src: snakeImg,
    content: (
      <RepositoryInfo link="https://github.com/Aktyn/Snake">
        Simple snake game easily implementable in any web page.
      </RepositoryInfo>
    ),
  },
  {
    src: zeroGBallImg,
    content: (
      <RepositoryInfo link="https://github.com/Aktyn/ZeroG-Ball">
        Logic game with simple, custom physics engine based on elastic collisions.
        <br />
        Game has been created for university project.
        <br />
        It has experimental voice control feature and built-in level creator.
      </RepositoryInfo>
    ),
  },
  {
    src: kulkaWTarapatach,
    content: (
      <RepositoryInfo link="https://github.com/Aktyn/kulka-w-tarapatach">
        My first game made back in the school days for nationwide competition.
        <br />I won the competition.
      </RepositoryInfo>
    ),
  },
  {
    src: astroKulkaImg,
    content: <div>Java game with Box2D physics and custom graphics engine</div>,
  },
  {
    src: tetrisImg,
    content: (
      <RepositoryInfo link="https://github.com/Aktyn/Tetris-widget">
        Simple tetris game. Easy to run.
        <br />
        Entire code is packed into Immediately-invoked function expression (IIFE) so it will execute
        as soon as script loads.
      </RepositoryInfo>
    ),
  },
  {
    src: avoidLines,
    content: (
      <RepositoryInfo link="https://github.com/Aktyn/avoid-lines">
        Simple game made during single boring class in school.
      </RepositoryInfo>
    ),
  },
]

const technologies = [
  { className: 'devicon-javascript-plain colored', tooltip: 'Plain Java Script' },
  { className: 'devicon-typescript-plain colored', tooltip: 'TypeScript' },
  { className: 'devicon-react-plain colored', tooltip: 'React' },
  { className: 'devicon-nodejs-plain colored', tooltip: 'Node.js' },
  { className: 'devicon-threejs-original colored', tooltip: 'THREE.js, WebGL, GLSL, SVG' },
  { className: 'devicon-java-plain colored', tooltip: 'Java' },
  { className: 'devicon-opengl-plain colored', tooltip: 'OpenGL' },
  { className: 'devicon-mongodb-plain colored', tooltip: 'MongoDB' },
  { className: 'devicon-postgresql-plain colored', tooltip: 'Postgresql' },
]
