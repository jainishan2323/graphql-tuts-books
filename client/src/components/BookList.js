import React from 'react'
import { gql } from 'apollo-boost';
import { graphql } from 'react-apollo';

const getBooksQuery = gql`
    {
        books {
            name
            id
        }
    }
`;

class BookList extends React.Component {
    render() {
        return (
            <div>
                <h3>Book List</h3>
                <ul>
                    <li></li>
                </ul>
            </div>
        )
    }
}

export default graphql(getBooksQuery)(BookList);
