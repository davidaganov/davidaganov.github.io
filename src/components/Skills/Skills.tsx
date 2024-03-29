import { useTranslation } from "react-i18next"
import Collapsible from "react-collapsible"
import styles from "./Skills.module.sass"
import { Title } from "../"

import { ReactComponent as HTMLIcon } from "./icons/html.svg"
import { ReactComponent as CSSIcon } from "./icons/css.svg"
import { ReactComponent as JSIcon } from "./icons/js.svg"
import { ReactComponent as OtherIcon } from "./icons/other.svg"

export interface SkillsProps {
  title: string
  list: SkillProps[]
}

export interface SkillProps {
  id: string
  title: string
  tags: string[]
}

export const Skills = () => {
  const { t } = useTranslation()

  const setIcon = (title: string) => {
    switch (title) {
      case "HTML":
        return <HTMLIcon />
      case "CSS":
        return <CSSIcon />
      case "JavaScript":
        return <JSIcon />
      default:
        return <OtherIcon />
    }
  }

  const list = Object.values(t("skills.data", { returnObjects: true }))

  const buildSkills = () => {
    const categories = list.map(({ id, title, list }) => {
      if (list.length > 0) {
        return (
          <Collapsible
            trigger={
              <h3>
                {title}
                {setIcon(title)}
              </h3>
            }
            classParentString={styles.item}
            triggerElementProps={{ id: `trigger-${id}` }}
            contentElementId={`content-${id}`}
            transitionTime={350}
            easing={"ease-in-out"}
            key={id}
            tabIndex={0}
          >
            <ul className={styles.list}>{buildItems(list)}</ul>
          </Collapsible>
        )
      }
    })

    return <div className={styles.accordion}>{categories}</div>
  }

  const buildItems = (list: SkillProps[]) => {
    return list.map(({ id, title, tags }) => {
      return (
        <li
          className={styles.content}
          key={id}
        >
          <p className={styles.title}>{title}</p>
          <ul className={styles.listNested}>{buildTags(tags)}</ul>
        </li>
      )
    })
  }

  const buildTags = (tags: string[]) => {
    return tags.map((skill) => {
      return (
        <li
          className={styles.listNestedItem}
          key={skill}
        >
          {skill}
        </li>
      )
    })
  }

  const skills_list = list.length !== 0 ? buildSkills() : <p className={styles.empty}>Not found</p>

  return (
    <section
      className={styles.skills}
      id="skills"
    >
      <div className="inner">
        <Title
          link="#skills"
          title={t("skills.title")}
          direction="rtl"
        />

        {skills_list}
      </div>
    </section>
  )
}
