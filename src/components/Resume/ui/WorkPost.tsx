import { Text, View, StyleSheet, Link } from "@react-pdf/renderer"

import { IconText, DateRange } from "."

export interface TitleProps {
  children: string
}

export interface WorkProject {
  id: number
  title: string
  url: string
  tech: string[]
  description: string
  duties: string[]
}

export interface WorkPostProps {
  data: {
    companyName: string
    companyUrl?: string
    startAt: string
    endAt?: string
    current?: string
    title: string
    location: string
    description: string
    list: string[]
    projects: WorkProject[]
  }
}

export interface WorkPlaceProps {
  url: string | undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any
}

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontFamily: "ua-brand",
    fontWeight: "bold",
    color: "#0a192f"
  },
  metaInfoContainer: {
    flexDirection: "row",
    marginTop: 8,
    alignItems: "center"
  },
  workPlace: {
    fontSize: 7,
    fontFamily: "Barcade-Brawl",
    fontWeight: "bold",
    color: "#213e73"
  },
  about: {
    marginTop: 8,
    marginBottom: 15
  },
  description: {
    marginBottom: 8,
    fontSize: 10,
    fontFamily: "ua-brand",
    color: "#0a192f"
  },
  list: {
    flexDirection: "row"
  },
  mark: {
    marginTop: 4,
    marginRight: 6,
    fontSize: 10,
    fontFamily: "ua-brand",
    color: "#0a192f"
  },
  item: {
    maxWidth: "90%",
    marginTop: 4,
    fontSize: 10,
    fontFamily: "ua-brand",
    color: "#0a192f"
  },
  project: {
    flexDirection: "column",
    marginBottom: 8
  },
  projectLink: {
    marginTop: 4,
    textDecoration: "none"
  },
  projectTitle: {
    fontSize: 10,
    fontFamily: "ua-brand",
    fontWeight: "bold",
    color: "#213e73"
  },
  projectDescription: {
    marginTop: 6,
    marginBottom: 4,
    fontSize: 10,
    fontFamily: "ua-brand",
    color: "#0a192f"
  },
  projectDuties: {
    flexDirection: "row"
  },
  projectDutiesItem: {
    maxWidth: "90%",
    marginTop: 4,
    fontSize: 10,
    fontFamily: "ua-brand",
    color: "#0a192f"
  },
  projectTech: {
    marginTop: 6,
    fontSize: 10,
    fontFamily: "ua-brand",
    color: "#213e73"
  }
})

const Title = ({ children }: TitleProps) => {
  return <Text style={styles.title}>{children}</Text>
}

const WorkPlace = ({ children, url }: WorkPlaceProps) => {
  if (url) {
    return (
      <Link src={url}>
        <Text style={styles.workPlace}>{children}</Text>
      </Link>
    )
  }

  return <Text style={styles.workPlace}>{children}</Text>
}

export const WorkPost = ({
  data: {
    title,
    companyName,
    companyUrl,
    location,
    startAt,
    endAt,
    current,
    description,
    list,
    projects
  }
}: WorkPostProps) => {
  const buildAbout = () => {
    return (
      <View>
        {description && description.length > 0 && (
          <Text style={styles.description}>{description}</Text>
        )}
        {list &&
          list.length > 0 &&
          list.map((item, index) => (
            <View
              key={index}
              style={styles.list}
            >
              <Text style={styles.mark}>•</Text>
              <Text style={styles.item}>{item}</Text>
            </View>
          ))}
        {projects &&
          projects.length > 0 &&
          projects.map((item, index) => (
            <View
              key={index}
              style={styles.project}
            >
              <Link
                src={item.url}
                style={styles.projectLink}
              >
                <Text style={styles.projectTitle}>{item.title}</Text>
              </Link>

              <Text style={styles.projectDescription}>{item.description}</Text>

              {item.duties.map((item, index) => (
                <View
                  key={index}
                  style={styles.projectDuties}
                >
                  <Text style={styles.mark}>•</Text>
                  <Text style={styles.projectDutiesItem}>{item}</Text>
                </View>
              ))}

              <Text style={styles.projectTech}>{item.tech.join(", ")}</Text>
            </View>
          ))}
      </View>
    )
  }

  const about = buildAbout()

  return (
    <View>
      <Title>{title}</Title>
      <View style={styles.metaInfoContainer}>
        {companyName ? <WorkPlace url={companyUrl}>{companyName}</WorkPlace> : null}
        <DateRange
          style={{ marginLeft: companyName ? "auto" : 0, marginRight: 16 }}
          startAt={startAt}
          endAt={endAt}
          current={current}
        />
        <IconText
          text={location}
          iconName="location"
        />
      </View>
      <View style={styles.about}>{about}</View>
    </View>
  )
}
