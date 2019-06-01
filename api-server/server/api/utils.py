from ipware import get_client_ip


def get_real_ip(request):
    try:
        return get_client_ip(request, request_header_order=['HTTP_X_REAL_IP'])[0] or "0.0.0.0"
    except:
        return "0.0.0.0"
