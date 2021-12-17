import { useLoaderData } from "remix"
import * as shiki from 'shiki'

interface LoaderData {
    html: string
}

export const loader = async (): Promise<LoaderData> => {
    const { unified} = await import('unified')

    // md -> mdast
    const { default: remarkParse } = await import('remark-parse')

    // mdast
    const { default: remarkGfm } = await import('remark-gfm')
    const { default: remarkMath } = await import('remark-math')

    // mdast -> hast
    const { default: remarkRehype } = await import('remark-rehype')

    // hast
    const { default: rehypeKatex } = await import('rehype-katex')
    const { default: rehypeShiki } = await import('@leafac/rehype-shiki')

    // hast -> html
    const { default: rehypeStringify } = await import('rehype-stringify')

    const transpiler = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkRehype)
        .use(rehypeKatex)
        .use(rehypeShiki, { highlighter: await shiki.getHighlighter({})})
        .use(rehypeStringify)

    const html = await transpiler.process([
        '# Hello, Neptune!',

        // remark-math, rehype-katex
        'Math: $f = 1$',

        // rehype-shiki
        ['```tsx',
        'const a = 1',
        'const b = () => a + 1',
        '```'].join('\n'),

        // remark-gfm
        'Check out the footnote[^1]',
        '[^1]: Did you learn something?',
    ].join('\n\n'))
    return { html: String(html) }
}

const DynamicImports = () => {
    const { html } = useLoaderData()
    return (
        <main>
            <h1>Dynamic imports</h1>
            <div dangerouslySetInnerHTML={{ __html: html }}/>
        </main>
    )
}
export default DynamicImports