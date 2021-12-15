import { useLoaderData } from "remix"

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

    // hast -> html
    const { default: rehypeStringify } = await import('rehype-stringify')

    const transpiler = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkRehype)
        .use(rehypeKatex)
        .use(rehypeStringify)

    const html = await transpiler.process([
        '# Hello, Neptune!',

        // remark-math, rehype-katex
        'Math: $f = 1$',

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