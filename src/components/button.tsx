type ButtonProps = {
    name: string,
    action: ()=> void,
    state?: 'active' | 'disabled',
}

export default function Button ({name,action,state}: ButtonProps) {
    return (
        <button className={
            `${state === 'disabled' ? 'opacity-40' : ''} px-5 py-3 bg-[var(--accent)]
            text-[var(--primary)] rounded-xl cursor-pointer hover:bg-[var(--accent-dark)]
            transition-color duration-150`
        }>
            {name}
        </button>
    )
}