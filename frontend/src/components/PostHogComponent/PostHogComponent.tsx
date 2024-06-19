import posthog from 'posthog-js'

posthog.init('phc_Kz2UulgJvjU0LU32hr7LzOyRn8entzJ77AmwAiMtMan',
    {
        api_host: 'https://us.i.posthog.com',
        person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
    }
)

const onClick = () => {
    console.log('Button A clicked')
    posthog.capture('button_clicked', { button_name: 'Button A' })
}

const PostHogComponent = () => {
    return <div>
        <h2>PostHog</h2>
        <button
            onClick={onClick}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            Button A
        </button>

    </div>
}

export default PostHogComponent;
