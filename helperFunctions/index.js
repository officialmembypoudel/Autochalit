export const imageURLGenerator = (bucket, id) => {
    const endpoint = 'https://playground.itsoch.com/v1/storage/buckets'

    if (id) {

        return `${endpoint}/${bucket}/files/${id}/view?project=autochalit`
    }
}


export const getFirstNameFromFullName = (fullName = '') => {
    if (fullName.includes(' ')) {
        return fullName.split(' ').slice(0, -1).join(' ')
    } else {
        return fullName
    }
}