// components/Sidebar.jsx
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Sidebar component displaying the list of applicants
 * @param {Object} props - Component props
 * @param {Array} props.applicants - List of applicants to display
 * @param {string|number} props.selectedId - Currently selected applicant ID
 */
const Sidebar = ({ applicants, selectedId }) => {
    const router = useRouter();

    const handleApplicantClick = (id) => {
        router.push(`/applicants/${id}`);
    };

    return (
        <div className="w-64 bg-gray-100 h-screen overflow-y-auto p-4 border-r border-gray-200">
            <h2 className="text-xl font-bold mb-4">Applicants</h2>
            <ul>
                {applicants.map((applicant: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                    <li
                        key={applicant.id}
                        className={`p-2 mb-2 rounded cursor-pointer hover:bg-gray-200 ${selectedId === applicant.id ? 'bg-gray-300' : ''
                            }`}
                        onClick={() => handleApplicantClick(applicant.id)}
                    >
                        {applicant.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;