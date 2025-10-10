import 'micromark-util-types'
import 'mdast-util-from-markdown'

declare module 'micromark-util-types' {
  interface TokenTypeMap {
    detailsContainer: 'detailsContainer'
    detailsContainerClasses: 'datailsContainerClasses',
    detailsContainerClassName: 'detailsContainerClassName'
    detailsContainerClassWhitespace: 'detailsContainerClassWhitespace'
    detailsContainerHeader: 'detailsContainerHeader'
    detailsContainerSequence: 'detailsContainerSequence'
    detailsContainerSummary: 'detailsContainerSummary'
    detailsContainerSummaryWithQuotes: 'detailsContainerSummaryWithQuotes'
    detailsExpanded: 'detailsExpanded'
    detailsIndent: "detailsIndent"
  }
}

declare module 'mdast-util-from-markdown' {
  interface CompileData {
    detailsAttributes?: { 
      open: boolean
      class?: string
    }
  }
}
