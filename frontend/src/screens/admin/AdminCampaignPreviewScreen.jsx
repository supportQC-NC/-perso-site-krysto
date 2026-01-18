import { useParams, Link } from "react-router-dom";
import { usePreviewCampaignQuery, useGetCampaignByIdQuery } from "../../slices/mailingApiSlice";
import Loader from "../../components/global/Loader";
import "./AdminCampaignPreviewScreen.css";

const AdminCampaignPreviewScreen = () => {
  const { id } = useParams();
  
  const { data: campaign, isLoading: isLoadingCampaign } = useGetCampaignByIdQuery(id);
  const { data: preview, isLoading: isLoadingPreview, error } = usePreviewCampaignQuery(id);

  if (isLoadingCampaign || isLoadingPreview) return <Loader />;

  if (error) {
    return (
      <div className="admin-campaign-preview">
        <div className="preview-error">
          <h2>❌ Erreur</h2>
          <p>Impossible de charger l'aperçu de la campagne.</p>
          <Link to="/admin/mailing" className="btn-back">
            ← Retour aux campagnes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-campaign-preview">
      <div className="preview-toolbar">
        <Link to="/admin/mailing" className="btn-back">
          ← Retour
        </Link>
        
        <div className="preview-info">
          <h1>{campaign?.name}</h1>
          <p>Sujet: {campaign?.subject}</p>
        </div>

        <div className="preview-actions">
          {campaign?.status === "draft" && (
            <Link to={`/admin/mailing/${id}/edit`} className="btn-edit">
              ✏️ Modifier
            </Link>
          )}
        </div>
      </div>

      <div className="preview-container">
        <div className="preview-device desktop">
          <div className="device-header">
            <span className="device-label">💻 Desktop</span>
          </div>
          <div className="device-frame">
            <iframe
              srcDoc={preview?.html}
              title="Desktop Preview"
              sandbox="allow-same-origin"
            />
          </div>
        </div>

        <div className="preview-device mobile">
          <div className="device-header">
            <span className="device-label">📱 Mobile</span>
          </div>
          <div className="device-frame">
            <iframe
              srcDoc={preview?.html}
              title="Mobile Preview"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCampaignPreviewScreen;
