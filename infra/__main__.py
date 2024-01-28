import os
import re
from typing import Optional
import pulumi
import pulumi_aws as aws
import pulumi_synced_folder as synced_folder


def get_pr_number() -> Optional[str]:
    ci_project = os.environ.get("PULUMI_CI_PROJECT")
    if not ci_project:
        return None

    ci_stack = os.environ.get("PULUMI_CI_STACK", "")
    pattern = rf"^pr-\S+-{ci_project}-([0-9]+)$"
    match = re.match(pattern, ci_stack)
    return match.group(1) if match else None


def get_host(config: pulumi.Config) -> str:
    host = config.get("host")
    if not host:
        raise ValueError("host is a required configuration field")

    pr_num = os.environ.get("PULUMI_PR_NUMBER")
    if pr_num:
        return f"{pr_num}.{host}"

    return host


def stack(config: pulumi.Config):
    path = config.get("path") or "../dist"
    index_document = config.get("indexDocument") or "index.html"

    # Create an S3 bucket and configure it as a website.
    bucket = aws.s3.Bucket(
        "bucket",
        website=aws.s3.BucketWebsiteArgs(
            index_document=index_document,
            error_document=index_document,
        ),
    )

    # Set ownership controls for the new bucket
    ownership_controls = aws.s3.BucketOwnershipControls(
        "ownership-controls",
        bucket=bucket.bucket,
        rule=aws.s3.BucketOwnershipControlsRuleArgs(
            object_ownership="ObjectWriter",
        ),
    )

    # Configure public ACL block on the new bucket
    public_access_block = aws.s3.BucketPublicAccessBlock(
        "public-access-block",
        bucket=bucket.bucket,
        block_public_acls=False,
    )

    # Use a synced folder to manage the files of the website.
    bucket_folder = synced_folder.S3BucketFolder(
        "bucket-folder",
        acl="public-read",
        bucket_name=bucket.bucket,
        path=path,
        opts=pulumi.ResourceOptions(
            depends_on=[ownership_controls, public_access_block]
        ),
    )

    us_east_1 = aws.Provider(
        "us-east-1",
        aws.ProviderArgs(
            region="us-east-1",
        ),
    )

    host = get_host(config)
    # create the certificate
    cert = aws.acm.Certificate(
        "frontendCert",
        domain_name=host,
        validation_method="DNS",
        opts=pulumi.ResourceOptions(provider=us_east_1),
    )
    validation_option = cert.domain_validation_options[0]

    zone = aws.route53.get_zone(name=host)
    # Set up the DNS records for validation
    validation_record = aws.route53.Record(
        "certValidationRecord",
        # Use the zone ID for the domain's hosted zone in Route 53
        zone_id=zone.id,
        name=validation_option["resource_record_name"],
        type=validation_option["resource_record_type"],
        records=[validation_option["resource_record_value"]],
        ttl=60,
    )

    aws.acm.CertificateValidation(
        "certValidation",
        certificate_arn=cert.arn,
        validation_record_fqdns=[validation_record.fqdn],
        opts=pulumi.ResourceOptions(provider=us_east_1),
    )

    # Create a CloudFront CDN to distribute and cache the website.
    cdn = aws.cloudfront.Distribution(
        "cdn",
        enabled=True,
        aliases=[host],
        origins=[
            aws.cloudfront.DistributionOriginArgs(
                origin_id=bucket.arn,
                domain_name=bucket.website_endpoint,
                custom_origin_config=aws.cloudfront.DistributionOriginCustomOriginConfigArgs(
                    origin_protocol_policy="http-only",
                    http_port=80,
                    https_port=443,
                    origin_ssl_protocols=["TLSv1.2"],
                ),
            ),
            # aws.cloudfront.DistributionOriginArgs(
            #     origin_id=host,
            #     domain_name=host,
            #     custom_origin_config=aws.cloudfront.DistributionOriginCustomOriginConfigArgs(
            #         origin_protocol_policy="http-only",
            #         http_port=80,
            #         https_port=443,
            #         origin_ssl_protocols=["TLSv1.2"],
            #     ),
            # )
        ],
        default_cache_behavior=aws.cloudfront.DistributionDefaultCacheBehaviorArgs(
            target_origin_id=bucket.arn,
            viewer_protocol_policy="redirect-to-https",
            allowed_methods=[
                "GET",
                "HEAD",
                "OPTIONS",
                "POST",
                "DELETE",
                "PUT",
                "PATCH",
            ],
            cached_methods=[
                "GET",
                "HEAD",
                "OPTIONS",
            ],
            default_ttl=600,
            max_ttl=600,
            min_ttl=600,
            forwarded_values=aws.cloudfront.DistributionDefaultCacheBehaviorForwardedValuesArgs(
                query_string=True,
                cookies=aws.cloudfront.DistributionDefaultCacheBehaviorForwardedValuesCookiesArgs(
                    forward="all",
                ),
                headers=["Origin"],
            ),
        ),
        price_class="PriceClass_100",
        custom_error_responses=[
            # aws.cloudfront.DistributionCustomErrorResponseArgs(
            #     error_code=404,
            #     response_code=404,
            #     response_page_path=f"/{error_document}",
            # )
        ],
        restrictions=aws.cloudfront.DistributionRestrictionsArgs(
            geo_restriction=aws.cloudfront.DistributionRestrictionsGeoRestrictionArgs(
                restriction_type="none",
            ),
        ),
        viewer_certificate=aws.cloudfront.DistributionViewerCertificateArgs(
            cloudfront_default_certificate=False,
            acm_certificate_arn=cert.arn,
            ssl_support_method="sni-only",
        ),
    )

    # Create a DNS A record to point to the CDN.
    aws.route53.Record(
        "bucketRedirect",
        zone_id=zone.zone_id,
        name="",
        type="A",
        aliases=[
            aws.route53.RecordAliasArgs(
                name=cdn.domain_name,
                zone_id=cdn.hosted_zone_id,
                evaluate_target_health=True,
            )
        ],
        opts=pulumi.ResourceOptions(
            depends_on=cert,
        ),
    )

    # Export the URLs and hostnames of the bucket and distribution.
    pulumi.export(
        "originURL", pulumi.Output.concat("http://", bucket.website_endpoint)
    )
    pulumi.export("originHostname", bucket.website_endpoint)
    pulumi.export("cdnURL", pulumi.Output.concat("https://", cdn.domain_name))
    pulumi.export("cdnHostname", cdn.domain_name)


# Import the program's configuration settings.
# config = pulumi.Config()
# stack(config)
