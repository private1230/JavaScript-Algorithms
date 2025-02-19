import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import {
    AuthProvider,
    RecordContextProvider,
    Resource,
    ResourceContextProvider,
    TestMemoryRouter,
} from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import { QueryClient } from '@tanstack/react-query';
import { AdminContext } from '../AdminContext';
import { AdminUI } from '../AdminUI';
import { List } from '../list/List';
import { Datagrid } from '../list/datagrid/Datagrid';
import { TextField } from '../field/TextField';
import { SimpleForm } from '../form/SimpleForm';
import { TextInput } from '../input/TextInput';
import { EditButton } from './EditButton';
import { Edit } from '../detail/Edit';

export default { title: 'ra-ui-materialui/button/EditButton' };

export const Basic = ({ buttonProps }: { buttonProps?: any }) => (
    <TestMemoryRouter>
        <AdminContext
            i18nProvider={polyglotI18nProvider(locale =>
                locale === 'fr' ? frenchMessages : englishMessages
            )}
        >
            <ResourceContextProvider value="books">
                <RecordContextProvider value={{ id: 1 }}>
                    <EditButton {...buttonProps} />
                </RecordContextProvider>
            </ResourceContextProvider>
        </AdminContext>
    </TestMemoryRouter>
);

export const AccessControl = () => {
    const queryClient = new QueryClient();

    return (
        <TestMemoryRouter>
            <AccessControlAdmin queryClient={queryClient} />
        </TestMemoryRouter>
    );
};

const AccessControlAdmin = ({ queryClient }: { queryClient: QueryClient }) => {
    const [resourcesAccesses, setResourcesAccesses] = React.useState({
        'books.list': true,
        'books.delete': false,
        'books.edit': false,
        'books.edit.1': false,
    });

    const authProvider: AuthProvider = {
        login: () => Promise.reject(new Error('Not implemented')),
        logout: () => Promise.reject(new Error('Not implemented')),
        checkError: () => Promise.resolve(),
        checkAuth: () => Promise.resolve(),
        canAccess: ({ resource, action, record }) =>
            new Promise(resolve =>
                setTimeout(
                    resolve,
                    300,
                    resourcesAccesses[
                        `${resource}.${action}${record && record.id === 1 ? `.${record.id}` : ''}`
                    ]
                )
            ),
        getPermissions: () => Promise.resolve(undefined),
    };

    return (
        <AdminContext
            dataProvider={dataProvider}
            authProvider={authProvider}
            i18nProvider={polyglotI18nProvider(locale =>
                locale === 'fr' ? frenchMessages : englishMessages
            )}
            queryClient={queryClient}
        >
            <AdminUI
                layout={({ children }) => (
                    <AccessControlLayout
                        resourcesAccesses={resourcesAccesses}
                        setResourcesAccesses={setResourcesAccesses}
                        queryClient={queryClient}
                    >
                        {children}
                    </AccessControlLayout>
                )}
            >
                <Resource name="books" list={BookList} edit={BookEdit} />
            </AdminUI>
        </AdminContext>
    );
};

const AccessControlLayout = ({
    children,
    resourcesAccesses,
    setResourcesAccesses,
    queryClient,
}: {
    children: React.ReactNode;
    resourcesAccesses: {
        'books.list': boolean;
        'books.delete': boolean;
        'books.edit': boolean;
        'books.edit.1': boolean;
    };
    setResourcesAccesses: (resourcesAccesses: any) => void;
    queryClient: QueryClient;
}) => {
    return (
        <div>
            <div>{children}</div>
            <hr />
            <label>
                <input
                    type="checkbox"
                    checked={resourcesAccesses['books.edit']}
                    onChange={e => {
                        setResourcesAccesses({
                            ...resourcesAccesses,
                            'books.edit': e.target.checked,
                        });
                        queryClient.clear();
                    }}
                />
                Allow editing books
            </label>
            <br />
            <label>
                <input
                    type="checkbox"
                    checked={resourcesAccesses['books.edit.1']}
                    onChange={e => {
                        setResourcesAccesses({
                            ...resourcesAccesses,
                            'books.edit.1': e.target.checked,
                        });
                        queryClient.clear();
                    }}
                />
                Allow editing War and Peace
            </label>
        </div>
    );
};

const BookList = () => {
    return (
        <List>
            <Datagrid>
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="year" />
                <EditButton />
            </Datagrid>
        </List>
    );
};

const BookEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="author" />
            <TextInput source="year" />
        </SimpleForm>
    </Edit>
);

const dataProvider = fakeRestDataProvider({
    books: [
        {
            id: 1,
            title: 'War and Peace',
            author: 'Leo Tolstoy',
            year: 1869,
        },
        {
            id: 2,
            title: 'Pride and Predjudice',
            author: 'Jane Austen',
            year: 1813,
        },
        {
            id: 3,
            title: 'The Picture of Dorian Gray',
            author: 'Oscar Wilde',
            year: 1890,
        },
        {
            id: 4,
            title: 'Le Petit Prince',
            author: 'Antoine de Saint-Exupéry',
            year: 1943,
        },
        {
            id: 5,
            title: "Alice's Adventures in Wonderland",
            author: 'Lewis Carroll',
            year: 1865,
        },
        {
            id: 6,
            title: 'Madame Bovary',
            author: 'Gustave Flaubert',
            year: 1856,
        },
        {
            id: 7,
            title: 'The Lord of the Rings',
            author: 'J. R. R. Tolkien',
            year: 1954,
        },
        {
            id: 8,
            title: "Harry Potter and the Philosopher's Stone",
            author: 'J. K. Rowling',
            year: 1997,
        },
        {
            id: 9,
            title: 'The Alchemist',
            author: 'Paulo Coelho',
            year: 1988,
        },
        {
            id: 10,
            title: 'A Catcher in the Rye',
            author: 'J. D. Salinger',
            year: 1951,
        },
        {
            id: 11,
            title: 'Ulysses',
            author: 'James Joyce',
            year: 1922,
        },
    ],
    authors: [],
});
