export default function Page404 () {
    return <div className="container mt-5">
        <div className="row justify-content-center">
            <div className="col-md-3 col-7">
                <img src="/404.png" className="card-img-top img-fluid" style={{ objectFit:"cover",height:"100%" }} alt="image 404" />
            </div>
            <div className="col-12">
                <h5 className="text-center mt-3" >Halaman tidak ditemukan</h5>
            </div>
        </div>
    </div>
}