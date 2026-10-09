"use client"

import { NavigationMenu } from "@base-ui/react/navigation-menu"

import { Icon } from "@/components/ui/icon/icon"
import { navGroups, type NavGroup } from "@/content/nav"
import { scrollToHash } from "@/lib/motion/gsap"

import styles from "./site-nav.module.scss"

const isGroup = (item: (typeof navGroups)[number]): item is NavGroup => "items" in item

/** Section links scroll through ScrollSmoother instead of jumping. */
function onAnchorClick(event: React.MouseEvent<HTMLAnchorElement>) {
  const href = event.currentTarget.getAttribute("href")
  if (!href?.startsWith("#") || event.metaKey || event.ctrlKey) return
  event.preventDefault()
  scrollToHash(href)
}

/**
 * Desktop navigation after shadcn/ui's Base UI "Navigation Menu": hover
 * intent, keyboard navigation and a popup that animates its size.
 * Capabilities opens a mega panel instead of a dropdown list.
 */
export function SiteNav() {
  return (
    <NavigationMenu.Root className={styles.root} aria-label="Main">
      <NavigationMenu.List className={styles.list}>
        {navGroups.map((item) =>
          isGroup(item) ? (
            <NavigationMenu.Item key={item.label}>
              <NavigationMenu.Trigger className={`${styles.link} ${styles.trigger}`}>
                {item.label}
                <NavigationMenu.Icon className={styles.chevron}>
                  <Icon name="chevron-down" />
                </NavigationMenu.Icon>
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className={styles.content}>
                <CapabilitiesPanel group={item} />
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          ) : (
            <NavigationMenu.Item key={item.href}>
              <NavigationMenu.Link className={styles.link} href={item.href} onClick={onAnchorClick}>
                {item.label}
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          )
        )}
      </NavigationMenu.List>

      <NavigationMenu.Portal>
        <NavigationMenu.Positioner className={styles.positioner} sideOffset={16} align="center" collisionPadding={16}>
          <NavigationMenu.Popup className={styles.popup}>
            <NavigationMenu.Viewport className={styles.viewport} />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  )
}

function CapabilitiesPanel({ group }: { group: NavGroup }) {
  return (
    <div className={styles.panel}>
      <NavigationMenu.Link className={styles.feature} href="#contact" onClick={onAnchorClick}>
        <span className={styles.featureTitle}>Send us a drawing</span>
        <span className={styles.featureText}>
          Material, quantity and tolerances in; a quote and lead time back.
        </span>
        <span className={styles.featureArrow} aria-hidden>
          <Icon name="arrow-right" />
        </span>
      </NavigationMenu.Link>
      <ul className={styles.grid}>
        {group.items.map((item) => (
          <li key={item.href}>
            <NavigationMenu.Link className={styles.item} href={item.href} onClick={onAnchorClick}>
              <span className={styles.itemTitle}>{item.label}</span>
              <span className={styles.itemText}>{item.tagline}</span>
            </NavigationMenu.Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
