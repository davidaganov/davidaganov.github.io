import { useChangelogUnreadIndicator } from "@docs/composables/useChangelogUnreadIndicator"
import {
  getFirstPathForSection,
  getSectionById,
  getSectionIdByPath,
  isGraphDocsPath
} from "@docs/utils/sections"
import { DOCS_HEADER_EXTRA_ACTIONS, DOCS_SECTIONS } from "@docs/constants"
import { ROUTE_PATH } from "@base/types"
import type { DocsHeaderNavAction, DocsSection } from "@docs/types"

const isPrimarySection = (section: DocsSection) => (section.navPlacement ?? "primary") === "primary"

const isTrailingSection = (section: DocsSection) => section.navPlacement === "trailing"

export const useDocsHeaderNav = () => {
  const { t } = useI18n()
  const route = useRoute()

  const localePath = useLocalePath()
  const { showUnreadDot } = useChangelogUnreadIndicator()

  const isDocsRoute = computed(() => route.path.includes(ROUTE_PATH.DOCS))
  const isGraphRoute = computed(() => isGraphDocsPath(route.path))

  const activeSectionId = computed(() => {
    if (isGraphRoute.value) return ""
    const sectionId = getSectionIdByPath(route.path)
    return getSectionById(sectionId)?.id || DOCS_SECTIONS[0]?.id || ""
  })

  const sectionAction = (section: DocsSection): DocsHeaderNavAction => {
    const showBadge = section.unreadBadge === "changelog" && showUnreadDot.value

    return {
      id: section.id,
      icon: section.icon,
      label: t(section.labelKey),
      to: localePath(getFirstPathForSection(section)),
      active: activeSectionId.value === section.id,
      showBadge,
      badgeAriaLabel: showBadge ? t("layout.a11y.changelogUnread") : undefined,
      mobileInline: isTrailingSection(section)
    }
  }

  const primaryTabs = computed(() =>
    DOCS_SECTIONS.filter(isPrimarySection).map((section) => sectionAction(section))
  )

  const trailingActions = computed<DocsHeaderNavAction[]>(() => {
    const extras: DocsHeaderNavAction[] = DOCS_HEADER_EXTRA_ACTIONS.map((action) => ({
      id: action.id,
      icon: action.icon,
      label: t(action.labelKey),
      to: localePath(action.path),
      active: action.isActive(route.path),
      showBadge: false,
      mobileInline: action.mobileInline ?? false
    }))

    const sections = DOCS_SECTIONS.filter(isTrailingSection).map((section) =>
      sectionAction(section)
    )

    return [...extras, ...sections]
  })

  const mobileInlineTrailingTabs = computed(() =>
    trailingActions.value.filter((action) => action.mobileInline)
  )

  const actionAriaLabel = (action: DocsHeaderNavAction) =>
    action.showBadge && action.badgeAriaLabel
      ? `${action.label}. ${action.badgeAriaLabel}`
      : action.label

  return {
    isDocsRoute,
    isGraphRoute,
    activeSectionId,
    primaryTabs,
    trailingActions,
    mobileInlineTrailingTabs,
    actionAriaLabel
  }
}
