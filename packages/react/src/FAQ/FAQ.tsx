import React, {forwardRef, PropsWithChildren} from 'react'
import {isFragment} from 'react-is'
import clsx from 'clsx'

import {useAnimation, Heading, AccordionHeading, AccordionContent, AccordionRoot, HeadingProps} from '..'
import type {BaseProps} from '../component-helpers'

/**
 * Design tokens
 */
import '@primer/brand-primitives/lib/design-tokens/css/tokens/functional/components/faq/base.css'
import '@primer/brand-primitives/lib/design-tokens/css/tokens/functional/components/faq/colors-with-modes.css'
import '@primer/brand-primitives/lib/design-tokens/css/tokens/functional/components/faq/faq.css'

/**
 * Main stylesheet (as a CSS Module)
 */
import styles from './FAQ.module.css'

type FAQRootProps = PropsWithChildren<BaseProps<HTMLElement>> & React.HTMLAttributes<HTMLElement>

const FAQRoot = forwardRef<HTMLElement, FAQRootProps>(({children, style, animate, className, ...rest}, ref) => {
  const {classes: animationClasses, styles: animationInlineStyles} = useAnimation(animate)

  const filteredChildren = React.Children.toArray(children).filter(child => {
    if (React.isValidElement(child) && typeof child.type !== 'string') {
      if (
        isFragment(child) ||
        child.type === FAQHeading ||
        child.type === FAQSubheading ||
        child.type === AccordionRoot
      ) {
        return true
      }
    }
    return false
  })

  const hasSubheading = React.Children.toArray(children).some(
    child => React.isValidElement(child) && typeof child.type !== 'string' && child.type === FAQSubheading,
  )

  return (
    <section
      ref={ref}
      className={clsx(styles.FAQ, animationClasses, className)}
      style={{...animationInlineStyles, ...style}}
      {...rest}
    >
      {React.Children.toArray(filteredChildren).map(child => {
        if (React.isValidElement(child) && typeof child.type !== 'string') {
          if (child.type === FAQHeading) {
            return React.cloneElement(child as React.ReactElement, {
              align: hasSubheading ? 'start' : child.props.align,
              size: hasSubheading ? 'large' : child.props.size,
            })
          }
        }
        return child
      })}
    </section>
  )
})

type FAQHeadingProps = BaseProps<HTMLHeadingElement> & {
  size?: 'medium' | 'large'
  align?: 'start' | 'center'
  children: React.ReactNode | React.ReactNode[]
  as?: HeadingProps['as']
}

const FAQHeading = forwardRef<HTMLHeadingElement, FAQHeadingProps>(
  ({children, className, size = 'medium', align = 'center', as, ...rest}, ref) => {
    const headingSize = size === 'medium' ? 'h3' : 'h2'
    return (
      <Heading
        as={as || headingSize}
        className={clsx(
          styles.FAQ__heading,
          size === 'large' && styles['FAQ__heading--large'],
          styles[`FAQ__heading--${align}`],
          className,
        )}
        ref={ref}
        {...rest}
      >
        {children}
      </Heading>
    )
  },
)

type FAQSubheadingProps = BaseProps<HTMLHeadingElement> & {
  align?: 'start' | 'center'
  children: React.ReactNode | React.ReactNode[]
  as?: Exclude<HeadingProps['as'], 'h1'>
}

function FAQSubheading({children, className, as = 'h3', ...rest}: FAQSubheadingProps) {
  return (
    <Heading as={as} className={clsx(styles.FAQ__subheading, className)} {...rest}>
      {children}
    </Heading>
  )
}

/**
 * FAQ component:
 * {@link https://primer.style/brand/components/FAQ/ See usage examples}.
 */
export const FAQ = Object.assign(FAQRoot, {
  Subheading: FAQSubheading,
  Heading: FAQHeading,
  Item: AccordionRoot,
  Question: AccordionHeading,
  Answer: AccordionContent,
})
