
const PropsDefaults = {
    code: 123456,
}
const ChallengeEmail = ({ data = PropsDefaults }) => {
    return <p>{data.code}</p>
}

export default ChallengeEmail