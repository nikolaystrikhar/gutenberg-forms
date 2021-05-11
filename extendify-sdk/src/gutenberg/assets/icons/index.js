import { get } from 'lodash'

function Icon({ icon }) {
    const icons = {
        library: (
            <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 20 20" fill="none">
                <g clipPath="url(#clip0)">
                    <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x={-4} y={0} width={29} height={28}>
                        <rect
                            width="19.6666"
                            height="19.6474"
                            transform="matrix(0.699908 0.714233 -0.724976 0.688774 10.2439 0)"
                            fill="black"
                        />
                    </mask>
                    <g mask="url(#mask0)">
                        <rect
                            x="0.00339341"
                            y="0.701607"
                            width="18.6666"
                            height="18.6474"
                            transform="matrix(0.715941 0.698161 -0.709154 0.705054 10.4294 -8.1563)"
                            stroke="black"
                        />
                    </g>
                    <rect
                        width="11.6128"
                        height="11.5957"
                        transform="matrix(0.710545 0.703466 -0.714551 0.699772 10.0079 0.414024)"
                        fill="black"
                    />
                    <rect
                        width="7.53985"
                        height="3.68769"
                        transform="matrix(0.708475 -0.705736 0.716585 0.697499 4.20924 8.58513)"
                        fill="white"
                    />
                </g>
                <defs>
                    <clipPath id="clip0">
                        <rect width={20} height={20} fill="white" />
                    </clipPath>
                </defs>
            </svg>
        ),
    }

    return get(icons, icon)
}

export default Icon
