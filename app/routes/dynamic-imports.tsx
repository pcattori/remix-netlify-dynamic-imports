import { useLoaderData } from "remix"

interface LoaderData {
    html: string
}

export const loader = async (): Promise<LoaderData> => {
    const { unified} = await import('unified')
    const { default: remarkParse } = await import('remark-parse')
    const { default: remarkRehype } = await import('remark-rehype')
    const { default: rehypeStringify } = await import('rehype-stringify')

    const transpiler = await unified()
        .use(remarkParse)
        .use(remarkRehype)
        .use(rehypeStringify)

    const html = await transpiler.process('# Hello, Neptune!')
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