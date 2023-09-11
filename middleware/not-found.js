const notFound = (req, res) => {
    res.status(404).redirect('404.html')
}

module.exports = notFound
